const express = require("express")
const router = express.Router()
const conseilController = require("../controllers/conseil.controller")
const { verifyToken } = require("../middleware/auth.middleware")

router.get("/", verifyToken, conseilController.getConseils)

module.exports = router