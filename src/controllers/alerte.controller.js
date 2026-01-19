const db = require("../config/database")
const { estDansPeriode } = require("../utils/helpers")
const { getMeteoData } = require("../services/meteoService")
const { SEUIL_METEO } = require("../config/alertes")

module.exports.getAlertes = async (req, res) => {
    try {
        const alertes = []

        const mois_actuel = new Date().getMonth() + 1
        const userId = req.userId

        const requete = `
            SELECT u.*, r.latitude, r.longitude 
            FROM utilisateur u 
            JOIN regions r ON u.id_region = r.id 
            WHERE u.id = ?
        `

        const [users] = await db.query(requete, [userId])

        if (users.length === 0) {
            return res.status(404).json({
                error: 'Tsy hita ny mpampiasa'
            })
        }

        const user = users[0]

        const [cultures] = await db.query("SELECT * FROM culture")

        for (const culture of cultures) {
            // Période de semis
            if (estDansPeriode(mois_actuel, culture.periode_semis_debut, culture.periode_semis_fin)) {
                alertes.push({
                    type: "periode",
                    priorite: "haute",
                    message: `Fotoanan’ny famafazana ho an’ny ${culture.nom_malagasy} izao`,
                    culture: culture.nom_malagasy
                })
            }

            // Période de récolte
            if (estDansPeriode(mois_actuel, culture.periode_recolte_debut, culture.periode_recolte_fin)) {
                alertes.push({
                    type: "periode",
                    priorite: "haute",
                    message: `Fotoanan’ny fijinjana ho an’ny ${culture.nom_malagasy} izao`,
                    culture: culture.nom_malagasy
                })
            }
        }

        if (user.latitude && user.longitude) {
            const meteoData = await getMeteoData(user.latitude, user.longitude)

            if (meteoData) {
                if (meteoData.precipitation > SEUIL_METEO.FORTE_PLUIE) {
                    alertes.push({
                        type: "meteo",
                        priorite: "haute",
                        message: `🌧️ Hisy orambe be ho avy (${Math.round(meteoData.precipitation)}mm) ! Arovy ny volinao.`
                    })
                }

                if (meteoData.wind_speed > SEUIL_METEO.VENT_FORT) {
                    alertes.push({
                        type: "meteo",
                        priorite: "moyenne",
                        message: `💨 Hisy rivotra mahery (${Math.round(meteoData.wind_speed)}km/h). Hamarino sy hamafiso ny fotodrafitrasa.`
                    })
                }

                if (
                    meteoData.precipitation < SEUIL_METEO.SECHERESSE &&
                    meteoData.humidity < 50
                ) {
                    alertes.push({
                        type: "meteo",
                        priorite: "moyenne",
                        message: `☀️ Maina ny andro. Aza adino ny manondraka ny volinao.`
                    })
                }
            }
        }

        res.status(200).json({ alertes })

    } catch (error) {
        console.error('Nisy olana teo am-pangalana ny fampitandremana:', error)
        res.status(500).json({
            error: 'Nisy olana teo amin’ny serveur'
        })
    }
}
