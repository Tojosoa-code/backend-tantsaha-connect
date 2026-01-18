const db = require("../config/database")

module.exports.getConseils = async (req, res) => {
    try {
        const { mois, culture } = req.query
        
        let sql = `SELECT DISTINCT c.* FROM conseils c`

        const params = []

        const conditions = []

        if (culture) {
            sql += ` INNER JOIN conseil_culture cc ON c.id = cc.id_conseil `
            conditions.push('cc.id_culture = ?')
            params.push(culture)
        }

        if (mois) {
            conditions.push(' ? BETWEEN c.periode_debut AND c.periode_fin')
            params.push(mois)
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(" AND ")
        }

        console.log(sql)
        
        const [conseils] = await db.query(sql, params);

        res.status(200).json({
            conseils
        })

    } catch (error) {
        console.error('Erreur lors de la récupération des conseils:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}