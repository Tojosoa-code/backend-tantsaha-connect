const db = require("../config/database")

module.exports.create = async (req, res) => {
    try {
        const { message, id_culture, date } = req.body
        const id_utilisateur = req.userId 

        const requete = 'INSERT INTO observations (id_utilisateur, message, date, id_culture) VALUES (?, ?, ?, ?)'

        const [result] = await db.query(requete, [id_utilisateur, message, date, id_culture])
        
        res.status(201).json({
            message: 'Observation créée avec succès',
            observationId : result.insertId
        })

    } catch (error) {
        console.error("Erreur lors de la création de l'observation : ", error)
        res.status(500).json({error : 'Erreur serveur'})
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const id_utilisateur = req.userId

        const requete = 'SELECT * FROM observations WHERE id_utilisateur = ?';

        const [observations] = await db.query(requete, [id_utilisateur]);
        
        res.status(200).json({
            observations
        })

    } catch (error) {
        console.error('Erreur lors de la récupération des observations:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports.update = async (req, res) => {
    try {
        const observationId = req.params.id
        const { message, date, id_culture } = req.body
        const id_utilisateur = req.userId

        const requete = 'SELECT * FROM observations WHERE id = ? AND id_utilisateur = ?'

        const [observation] = await db.query(requete, [observationId, id_utilisateur])

        if (observation.length === 0) {
            return res.status(404).json({ error: 'Observation non trouvé ou non autorisée' })
        }

        const requete2 = 'UPDATE observations SET message = ?, date = ?, id_culture = ? WHERE id = ?'

        await db.query(requete2, [message, date, id_culture, observationId])

        res.status(200).json({
            message : 'Observation modifiée avec succès'
        })

    } catch (error) {
        console.error('Erreur lors de la modification:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const observationId = req.params.id
        const id_utilisateur = req.userId

        const requete = 'SELECT * FROM observations WHERE id = ? AND id_utilisateur = ?'

        const [observation] = await db.query(requete, [observationId, id_utilisateur])

        if (observation.length === 0) {
            return res.status(404).json({ error: 'Observation non trouvé ou non autorisée' })
        }

        const requete2 = 'DELETE FROM observations WHERE id = ?'

        await db.query(requete2, [observationId])

        res.status(200).json({
            message : 'Observation supprimé avec succès'
        })

    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
