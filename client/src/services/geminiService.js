const axios = require("axios");

const GEMINI_API_URL = "https://api.gemini.com/v1/ai/generate"; // exemple, adapter selon doc Gemini

/**
 * Génère des questions à partir d’un texte.
 * @param {string} text Dataset ou description d'infraction
 * @returns {Array} liste de questions générées
 */
const generateQuestions = async (text) => {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        prompt: `Génère 3 questions à choix multiple avec la bonne réponse à partir de ce texte : ${text}`,
        max_tokens: 300,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Gemini renvoie souvent un champ `choices` ou `result` selon la doc
    const generatedText = response.data?.result || response.data?.choices[0]?.text;
    // Ici tu peux parser les questions si Gemini renvoie sous forme textuelle
    return generatedText.split("\n").filter(Boolean);
  } catch (error) {
    console.error("Error generating questions from Gemini:", error.response?.data || error.message);
    return [];
  }
};

module.exports = { generateQuestions };
