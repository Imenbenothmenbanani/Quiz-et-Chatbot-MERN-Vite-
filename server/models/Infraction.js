const mongoose = require("mongoose");

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
}, { timestamps: true });

module.exports = mongoose.model("Infraction", infractionSchema);