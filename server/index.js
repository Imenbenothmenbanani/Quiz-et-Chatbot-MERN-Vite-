const express = require("express");
const app = express();
require("dotenv").config();

const routes = require("./routes/routes");
const aiRoutes = require("./routes/aiRoutes");
const cookieParser = require("cookie-parser");

const database = require("./config/database");
const cors = require("cors");

// ⚠️ IMPORTANT: Importer le modèle Infraction AVANT d'initialiser l'AI
require("./models/Infraction");

const { initialize: initializeAI } = require("./controllers/aiController");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 4000;

// connect to db
database.connectToDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

app.use("/api/v1/", routes);
app.use("/api/v1/ai", aiRoutes);

// Initialize AI after server starts
app.listen(PORT, async () => {
  console.log(`🚀 App is running on port ${PORT}`);
  
  // Attendre que la DB soit connectée avant d'initialiser l'AI
  setTimeout(async () => {
    console.log("🤖 Initialisation du chatbot AI...");
    try {
      await initializeAI();
      console.log("✅ Chatbot AI prêt!");
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation du chatbot:", error);
    }
  }, 2000); // Attendre 2 secondes après le démarrage
});