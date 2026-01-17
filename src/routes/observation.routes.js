const express = require("express")
const router = express.Router()
const observationController = require("../controllers/observation.controller")
const { verifyToken } = require("../middleware/auth.middleware")

router.post("/", verifyToken, observationController.create)
router.get("/", verifyToken, observationController.getAll)
router.put("/:id", verifyToken, observationController.update)
router.delete("/:id", verifyToken, observationController.delete)

module.exports = router