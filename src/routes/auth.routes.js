const express = require("express")
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profil", verifyToken, (req, res) => {
    res.json({
        message: "Route protégé accessible !",
        userId : req.userId
    })
})

module.exports = router