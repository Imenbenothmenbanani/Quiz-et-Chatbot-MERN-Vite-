const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/Auth");
const { 
  chat, 
  reinitializeVectorStore, 
  getStatus 
} = require("../controllers/aiController");

// Routes protégées par authentification
router.post("/chat", authMiddleware, chat);
router.post("/reinitialize", authMiddleware, reinitializeVectorStore);
router.get("/status", authMiddleware, getStatus);

module.exports = router;