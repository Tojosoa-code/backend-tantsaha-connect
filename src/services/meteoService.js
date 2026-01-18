const axios = require("axios")

module.exports.getMeteoData = async (latitude, longitude) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

        const response = await axios.get(url);
        console.log(response)

        return {
            temperature: response.data.main.temp,
            precipitation: response.data.rain ? response.data.rain['1h'] || 0 : 0,
            wind_speed: response.data.wind.speed * 3.6, // Conversion m/s -> km/h
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error.message);
        return null;
    }
}