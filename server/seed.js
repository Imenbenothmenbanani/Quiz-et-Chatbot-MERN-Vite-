// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// --------------- Config MongoDB ----------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizzy";

// --------------- Schéma MongoDB ----------------
const infractionSchema = new mongoose.Schema({
  id: Number,
  categorie: String,
  infraction: String,
  description: String,
  article: String,
  sanction_prison: String,
  sanction_amende: String,
  aggravation: String,
  mots_cles: [String],
  exemples: [String],
});

const Infraction = mongoose.model("Infraction", infractionSchema);

// --------------- Connexion ----------------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connecté !");
    importData();
  })
  .catch((err) => {
    console.error("❌ Erreur connexion MongoDB:", err);
    process.exit(1);
  });

// --------------- Importer les données ----------------
async function importData() {
  try {
    const filePath = path.join(__dirname, "database.json");
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.error("❌ Le fichier database.json n'existe pas !");
      console.log("📁 Chemin recherché:", filePath);
      console.log("\n💡 Créez un fichier database.json avec vos données d'infractions.");
      process.exit(1);
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!jsonData.infractions || !Array.isArray(jsonData.infractions)) {
      console.error("❌ Aucune infraction trouvée dans le fichier JSON !");
      console.log("Le fichier doit avoir cette structure:");
      console.log(`{
  "infractions": [
    {
      "id": 1,
      "categorie": "Crimes contre les personnes",
      "infraction": "Homicide volontaire",
      "description": "...",
      "article": "Art. 201",
      ...
    }
  ]
}`);
      process.exit(1);
    }

    // Supprime les anciennes données
    await Infraction.deleteMany({});
    console.log("🗑️  Anciennes infractions supprimées.");

    // Insérer les nouvelles
    await Infraction.insertMany(jsonData.infractions);
    console.log(`✅ ${jsonData.infractions.length} infractions ajoutées avec succès !`);

    mongoose.disconnect();
    console.log("✅ Import terminé !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors de l'importation :", err);
    process.exit(1);
  }
}