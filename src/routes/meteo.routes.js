const express = require('express');
const router = express.Router();
const meteoController = require('../controllers/meteo.controller');
const { verifyToken } = require("../middleware/auth.middleware")

// Route protégée
router.get('/', verifyToken, meteoController.getMeteo);

module.exports = router;