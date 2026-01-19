const db = require('../config/database');
const axios = require('axios');

module.exports.getMeteo = async (req, res) => {
  try {
    const userId = req.userId; // Depuis le middleware JWT

    // 1. Récupérer l'utilisateur avec sa région (JOIN comme dans alertes)
    const [users] = await db.query(
      `SELECT u.*, r.latitude, r.longitude, r.nom as region_nom
       FROM utilisateur u 
       JOIN regions r ON u.id_region = r.id 
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = users[0];

    if (!user.latitude || !user.longitude) {
      return res.status(400).json({ error: 'Coordonnées GPS manquantes pour cette région' });
    }

    // 2. Appeler l'API OpenWeather pour la météo actuelle
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const meteoUrl = `https://api.openweathermap.org/data/2.5/weather`;
    
    const meteoRes = await axios.get(meteoUrl, {
      params: {
        lat: user.latitude,
        lon: user.longitude,
        appid: apiKey,
        units: 'metric',
        lang: 'fr'
      }
    });

    // 3. Appeler l'API pour les prévisions 5 jours (gratuit)
    // Note: L'API gratuite donne forecast sur 5 jours par tranches de 3h
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast`;
    
    const forecastRes = await axios.get(forecastUrl, {
      params: {
        lat: user.latitude,
        lon: user.longitude,
        appid: apiKey,
        units: 'metric',
        lang: 'fr'
      }
    });

    // 4. Traiter les données pour avoir 1 prévision par jour
    const previsionsParJour = traiterPrevisions(forecastRes.data.list);

    // 5. Formater et renvoyer
    res.status(200).json({
      region: user.region_nom,
      actuelle: {
        temp: meteoRes.data.main.temp,
        feels_like: meteoRes.data.main.feels_like,
        humidity: meteoRes.data.main.humidity,
        wind_speed: meteoRes.data.wind.speed * 3.6, // m/s vers km/h
        weather: meteoRes.data.weather,
        rain: meteoRes.data.rain || null
      },
      previsions: previsionsParJour
    });

  } catch (error) {
    console.error('Erreur météo:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de la météo',
      details: error.message 
    });
  }
};

// Fonction helper pour grouper les prévisions par jour
function traiterPrevisions(forecastList) {
  const joursMap = new Map();

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const jourKey = date.toISOString().split('T')[0]; // Format YYYY-MM-DD

    if (!joursMap.has(jourKey)) {
      joursMap.set(jourKey, {
        dt: item.dt,
        temps: [],
        pluie: 0
      });
    }

    const jour = joursMap.get(jourKey);
    jour.temps.push(item.main.temp);
    jour.pluie = Math.max(jour.pluie, item.pop); // Probabilité max de pluie
    
    // Garder le weather du milieu de journée (vers 12h)
    if (!jour.weather && date.getHours() >= 11 && date.getHours() <= 14) {
      jour.weather = item.weather;
    }
  });

  // Convertir en tableau et calculer min/max par jour
  return Array.from(joursMap.values()).slice(0, 7).map(jour => ({
    dt: jour.dt,
    temp: {
      min: Math.round(Math.min(...jour.temps)),
      max: Math.round(Math.max(...jour.temps))
    },
    weather: jour.weather || [{ main: 'Clear', description: 'dégagé', icon: '01d' }],
    pop: jour.pluie
  }));
}
