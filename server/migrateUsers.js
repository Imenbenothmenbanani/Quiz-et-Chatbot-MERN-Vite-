// migrateUsers.js - À placer dans le dossier server/
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Attempt = require("./models/Attempt");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizzy";

async function migrateUsers() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connexion MongoDB réussie");

    // Récupérer tous les utilisateurs
    const users = await User.find({});
    console.log(`📊 ${users.length} utilisateurs trouvés`);

    for (const user of users) {
      console.log(`\n🔄 Mise à jour de l'utilisateur: ${user.username}`);

      // Récupérer toutes les tentatives de cet utilisateur
      const attempts = await Attempt.find({ userId: user._id });
      
      // Calculer les statistiques
      let totalScore = 0;
      let totalCoins = 0;
      let quizzesCompleted = attempts.length;

      for (const attempt of attempts) {
        totalScore += attempt.score;
        
        // Calculer les coins pour cette tentative
        const coinsForAttempt = attempt.score * 10;
        
        // Vérifier si c'était un score parfait (besoin de connaître le nombre de questions)
        // Pour simplifier, on suppose que chaque quiz avait le même nombre de questions
        const isPerfect = attempt.score === attempt.answers.length;
        const bonusCoins = isPerfect ? 50 : 0;
        
        totalCoins += coinsForAttempt + bonusCoins;
      }

      // Mettre à jour l'utilisateur
      user.coins = totalCoins;
      user.totalScore = totalScore;
      user.quizzesCompleted = quizzesCompleted;

      await user.save();

      console.log(`   ✅ Mis à jour:`);
      console.log(`      - Coins: ${totalCoins}`);
      console.log(`      - Score total: ${totalScore}`);
      console.log(`      - Quiz complétés: ${quizzesCompleted}`);
    }

    console.log("\n✅ Migration terminée avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateUsers();