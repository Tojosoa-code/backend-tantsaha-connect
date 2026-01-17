const db = require("../config/database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.register = async (req, res) => {
    try {
        const { nom, prenom, numero_telephone, mot_de_passe, id_region } = req.body;

        const verify_numero = 'SELECT * FROM utilisateur WHERE numero_telephone = ?';

        const [user] = await db.query(verify_numero, [numero_telephone]);

        if (user.length > 0) {
            return res.status(400).json({error : 'Ce numméro de téléphone est déjà utilisé'})
        }

        const hash_password = await bcrypt.hash(mot_de_passe, 10);

        const inserer = 'INSERT INTO utilisateur (nom, prenom, numero_telephone, mot_de_passe, id_region) VALUES (?, ?, ?, ?, ?)'

        const [result] = await db.query(inserer, [nom, prenom, numero_telephone, hash_password, id_region])

        res.status(201).json({
                    message: "Inscription réussie",
                    userId: result.insertId
                })
    } catch (error) {
        console.error('Erreur lors de l\'inscription: ', error)
        res.status(500).json({error : 'Erreur serveur'})
    }
}

module.exports.login = async (req, res) => {
    try {
        const { numero_telephone, mot_de_passe } = req.body;

        const requete = 'SELECT * FROM utilisateur WHERE numero_telephone = ?'

        const [users] = await db.query(requete, [numero_telephone])

        if (users.length === 0) {
            return res.status(401).json({error : 'Numéro de téléphone ou mot de passe incorrect'})
        }

        const user = users[0]

        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!isPasswordValid) {
            return res.status(401).json({error : 'Numéro de téléphone ou mot de passe incorrect'})
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                numero_telephone : user.numero_telephone
            }
        })

    } catch (error) {
        console.error('Erreur lors de la connexion : ', error)
        res.status(500).json({error : 'Erreur serveur'})
    }
}