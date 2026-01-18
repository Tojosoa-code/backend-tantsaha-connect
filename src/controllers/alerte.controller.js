const db = require("../config/database")
const { estDansPeriode } = require("../utils/helpers")
const { getMeteoData } = require("../services/meteoService")
const { SEUIL_METEO } = require("../config/alertes")

module.exports.getAlertes = async (req, res) => {
    {
        try {
            const alertes = []

            const mois_actuel = new Date().getMonth() + 1
            const userId = req.userId

            const requete = `SELECT u.*, r.latitude, r.longitude FROM utilisateur u JOIN regions r ON u.id_region = r.id WHERE u.id = ?`

            const [users] = await db.query(requete, [userId])

            if (users.length === 0) {
                return res.status(404).json({
                    error: 'Utilisateur non trouvé'
                })
            }

            const user = users[0]

            const [cultures] = await db.query("SELECT * FROM culture")

            for (const culture of cultures) {
                // Vérifier période de semis
                if (estDansPeriode(mois_actuel, culture.periode_semis_debut, culture.periode_semis_fin)) {
                    alertes.push({
                    type: "periode",
                    priorite: "haute",
                    message: `C'est la période de semis pour le ${culture.nom_francais}`,
                    culture: culture.nom_francais
                    });
                }

                // Vérifier période de récolte
                if (estDansPeriode(mois_actuel, culture.periode_recolte_debut, culture.periode_recolte_fin)) {
                    alertes.push({
                    type: "periode",
                    priorite: "haute",
                    message: `C'est la période de récolte pour le ${culture.nom_francais}`,
                    culture: culture.nom_francais
                    });
                }
            }

            if (user.latitude && user.longitude) {
                const meteoData = await getMeteoData(user.latitude, user.longitude)

                if (meteoData) {
                    if (meteoData.precipitation > SEUIL_METEO.FORTE_PLUIE) {
                        alertes.push({
                            type: "meteo",
                            priorite: "haute",
                            message: `Forte pluie prévue (${Math.round(meteoData.precipitation)}mm) ! Protégez vos cultures.`
                        });
                    }

                    if (meteoData.wind_speed > SEUIL_METEO.VENT_FORT) {
                        alertes.push({
                            type: "meteo",
                            priorite: "moyenne",
                            message: `Vent fort prévu (${Math.round(meteoData.wind_speed)}km/h). Renforcez vos installations.`
                        });
                    }

                            // Alerte sécheresse
                    if (meteoData.precipitation < SEUIL_METEO.SECHERESSE && meteoData.humidity < 50) {
                        alertes.push({
                            type: "meteo",
                            priorite: "moyenne",
                            message: `☀️ Temps sec. Pensez à irriguer vos cultures.`
                        });
                    }
                }
            }

            res.status(200).json({ alertes })
            
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}