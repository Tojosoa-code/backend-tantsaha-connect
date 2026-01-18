const express = require("express")
const router = express.Router()
const alerteController = require("../controllers/alerte.controller")
const { verifyToken } = require("../middleware/auth.middleware")

router.get("/", verifyToken, alerteController.getAlertes)

module.exports = router