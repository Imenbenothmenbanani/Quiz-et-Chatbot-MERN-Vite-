const { Ollama } = require('ollama');
const mongoose = require('mongoose');

// Initialiser Ollama
const ollama = new Ollama({ host: 'http://localhost:11434' });

// Store vectoriel en mémoire (simple array-based)
let embeddings = [];
let documents = [];

// Fonction de similarité cosinus
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Initialiser le store vectoriel
async function initializeVectorStore() {
  try {
    const Infraction = mongoose.model('Infraction');
    const infractions = await Infraction.find({});
    
    if (infractions.length === 0) {
      console.log("⚠️ Aucune infraction trouvée dans la base de données");
      return;
    }

    // Préparer les documents
    documents = infractions.map(inf => ({
      id: inf.id || inf._id.toString(),
      content: `Catégorie: ${inf.categorie}
Infraction: ${inf.infraction}
Description: ${inf.description}
Article: ${inf.article}
Sanction Prison: ${inf.sanction_prison}
Sanction Amende: ${inf.sanction_amende}
${inf.aggravation ? `Aggravation: ${inf.aggravation}` : ''}
Mots-clés: ${inf.mots_cles?.join(', ') || ''}
${inf.exemples?.length > 0 ? `Exemples: ${inf.exemples.join('; ')}` : ''}`,
      metadata: {
        categorie: inf.categorie,
        infraction: inf.infraction,
        article: inf.article
      }
    }));

    console.log(`📚 ${documents.length} documents chargés`);

    // Générer les embeddings
    console.log("🔄 Génération des embeddings...");
    embeddings = [];
    
    for (let i = 0; i < documents.length; i++) {
      const response = await ollama.embeddings({
        model: 'nomic-embed-text:latest',
        prompt: documents[i].content
      });
      embeddings.push(response.embedding);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Progression: ${i + 1}/${documents.length}`);
      }
    }

    console.log("✅ Vector store initialisé avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation du vector store:", error);
  }
}

// Rechercher les documents pertinents
async function retrieveRelevantDocs(query, k = 3) {
  if (embeddings.length === 0 || documents.length === 0) {
    throw new Error("Vector store non initialisé");
  }

  // Générer l'embedding de la requête
  const response = await ollama.embeddings({
    model: 'nomic-embed-text:latest',
    prompt: query
  });

  // Calculer les similarités
  const similarities = embeddings.map((embedding, idx) => ({
    idx,
    similarity: cosineSimilarity(response.embedding, embedding)
  }));

  // Trier et prendre les k meilleurs
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  return similarities.slice(0, k).map(item => documents[item.idx]);
}

// Endpoint pour le chat
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: "Le message est requis" 
      });
    }

    // Vérifier si le vector store est initialisé
    if (embeddings.length === 0) {
      await initializeVectorStore();
    }

    // Récupérer les documents pertinents
    const relevantDocs = await retrieveRelevantDocs(message, 3);

    // Construire le contexte
    const context = relevantDocs
      .map((doc, i) => `Document ${i + 1}:\n${doc.content}`)
      .join('\n\n---\n\n');

    // Construire le prompt système
    const systemPrompt = `Tu es un assistant juridique spécialisé dans le droit tunisien. 
Tu réponds aux questions sur les infractions, les sanctions et les articles de loi.

Contexte juridique pertinent:
${context}

Instructions:
- Réponds de manière claire et précise
- Cite les articles de loi pertinents
- Si l'information n'est pas dans le contexte, dis-le clairement
- Reste professionnel et objectif
- Réponds en français`;

    // Construire l'historique des messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Générer la réponse avec streaming
    const stream = await ollama.chat({
      model: 'llama3.2:latest',
      messages: messages,
      stream: true
    });

    // Configuration du streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    for await (const chunk of stream) {
      if (chunk.message?.content) {
        fullResponse += chunk.message.content;
        res.write(`data: ${JSON.stringify({ 
          content: chunk.message.content,
          done: false 
        })}\n\n`);
      }
      
      if (chunk.done) {
        res.write(`data: ${JSON.stringify({ 
          content: '',
          done: true,
          fullResponse: fullResponse,
          sources: relevantDocs.map(doc => ({
            categorie: doc.metadata.categorie,
            infraction: doc.metadata.infraction,
            article: doc.metadata.article
          }))
        })}\n\n`);
        res.end();
      }
    }

  } catch (error) {
    console.error("❌ Erreur dans le chat:", error);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la génération de la réponse",
        details: error.message 
      });
    }
  }
};

// Endpoint pour réinitialiser le vector store
exports.reinitializeVectorStore = async (req, res) => {
  try {
    await initializeVectorStore();
    return res.status(200).json({ 
      success: true, 
      message: "Vector store réinitialisé avec succès",
      documentsCount: documents.length
    });
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Endpoint pour obtenir le statut
exports.getStatus = async (req, res) => {
  try {
    const isInitialized = embeddings.length > 0 && documents.length > 0;
    
    return res.status(200).json({
      success: true,
      data: {
        initialized: isInitialized,
        documentsCount: documents.length,
        ollamaHost: 'http://localhost:11434'
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Initialiser au démarrage
module.exports.initialize = initializeVectorStore;
