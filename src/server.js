const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const db = require("./config/database")
const authRoutes = require("./routes/auth.routes")
const observationRoutes = require("./routes/observation.routes")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/observation", observationRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});