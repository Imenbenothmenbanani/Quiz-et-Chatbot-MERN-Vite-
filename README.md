# 🎓 QUIZZY - Plateforme de Quiz Interactive avec Intelligence Artificielle

## 🎯 Vue d'ensemble du projet {#vue-densemble}

**Quizzy** est une plateforme web interactive de création et de passage de quiz avec un assistant juridique intelligent basé sur l'IA et la technique RAG (Retrieval-Augmented Generation).

### Objectifs principaux
- ✅ Permettre aux administrateurs de créer et gérer des quiz
- ✅ Offrir aux utilisateurs une expérience de quiz engageante avec gamification
- ✅ Fournir un assistant IA pour répondre aux questions juridiques
- ✅ Suivre les performances et classement des utilisateurs

### ✨ Caractéristiques Principales
- 📝 Création de quiz avec timer
- 🤖 Assistant IA juridique avec RAG
- 💰 Système de gamification (coins et classement)
- 🎵 Expérience immersive (sons et animations)
- 🏆 Leaderboard en temps réel

---

### Points innovants
- 🤖 **Chatbot juridique intelligent** utilisant RAG et Ollama
- 🎮 **Système de gamification** avec coins et classement
- 🎵 **Expérience immersive** avec sons et animations
- 📊 **Analytics en temps réel** des performances

---
## 🎥 Démonstration Vidéo

<div align="center">

### 📹 Vidéo de Démonstration

<!-- Affiche une image cliquable ou un lien direct car GitHub n'affiche pas directement les vidéos locales -->

[![Regarder la vidéo de démonstration](https://img.shields.io/badge/▶️_Lancer-La_Vidéo_de_Démonstration-0052CC?style=for-the-badge&logo=google-chrome&logoColor=white)](Video/video_quiz.mp4)

<br>  


https://github.com/user-attachments/assets/96f58f06-0581-452d-9b6e-139bd4829f1d


**[🔗 Lien direct ve

Uploading Design sans titre.mp4…

rs le fichier vidéo (MP4)](Video/vidéo.mp4)**

*Cliquez sur le bouton ou le lien ci-dessus pour télécharger/voir la démonstration*

</div>
```

### Contenu de la Vidéo
- **0:00-2:00** : Présentation générale de la plateforme
- **2:00-5:00** : Passage de quiz avec timer et gamification
- **5:00-8:00** : Chatbot IA juridique avec RAG
- **8:00-10:00** : Panel administrateur et gestion des quiz

---
# 🎓 QUIZZY - Plateforme de Quiz Interactive avec Intelligence Artificielle

## 📋 Table des Matières
1. [Vue d'ensemble du projet](#vue-densemble)
2. [Architecture technique](#architecture)
3. [Fonctionnalités par rôle](#fonctionnalités)
4. [Intelligence Artificielle & RAG](#ia)
5. [Technologies utilisées](#technologies)
6. [Diagrammes et schémas](#diagrammes)

---


## 🏗️ Architecture Technique {#architecture}

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    React + Vite + TailwindCSS                │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Pages     │  │ Components │  │   AI Chatbot         │  │
│  │  - Home    │  │  - Button  │  │   - WebSocket Stream │  │
│  │  - Quiz    │  │  - Cards   │  │   - RAG Interface    │  │
│  │  - Profile │  │  - Navbar  │  │   - Voice Support    │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕️ REST API / SSE
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                     Node.js + Express                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │Controllers │  │ Middleware │  │   AI Controller      │  │
│  │  - User    │  │  - Auth    │  │   - Embeddings       │  │
│  │  - Quiz    │  │  - Admin   │  │   - Vector Search    │  │
│  │  - AI      │  │  - CORS    │  │   - LLM Integration  │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────────┐              ┌───────────────────┐    │
│  │   MongoDB        │              │   Ollama LLM      │    │
│  │   - Users        │              │   - llama3.2      │    │
│  │   - Quizzes      │              │   - nomic-embed   │    │
│  │   - Questions    │              │   - Vector Store  │    │
│  │   - Attempts     │              │   - RAG Pipeline  │    │
│  │   - Infractions  │              └───────────────────┘    │
│  └──────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### Structure des Dossiers

#### Backend
```
server/
├── config/
│   └── database.js              # Configuration MongoDB
├── controllers/
│   ├── userController.js        # Authentification
│   ├── quizController.js        # CRUD Quiz + Leaderboard
│   ├── questionController.js    # CRUD Questions
│   └── aiController.js          # 🤖 IA & RAG
├── middleware/
│   └── Auth.js                  # JWT & Role-based access
├── models/
│   ├── User.js                  # Schéma utilisateur + coins
│   ├── Quiz.js                  # Schéma quiz
│   ├── Question.js              # Schéma questions
│   ├── Attempt.js               # Historique tentatives
│   └── Infraction.js            # 🤖 Base de connaissances juridiques
├── routes/
│   ├── routes.js                # Routes principales
│   └── aiRoutes.js              # 🤖 Routes IA
├── index.js                     # Point d'entrée
└── seed.js                      # Import données juridiques
```

#### Frontend
```
client/
├── public/
│   └── sounds/
│       └── clock-tick.mp3       # 🎵 Son du timer
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Navbar.jsx
│   │   ├── Chatbot.jsx          # 🤖 Interface chatbot
│   │   ├── DashboardLayout.jsx
│   │   └── core/
│   │       ├── attemptQuiz/
│   │       ├── createQuiz/
│   │       └── Home/
│   ├── hooks/
│   │   └── useSound.js          # 🎵 Gestion des sons
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx          # 💰 Affichage coins
│   │   ├── Leaderboard.jsx      # 🏆 Classement
│   │   ├── AttemptQuiz.jsx
│   │   ├── QuizResult.jsx       # 🎉 Résultats + animations
│   │   └── ...
│   ├── services/
│   │   ├── apiConnector.js
│   │   ├── APIs.js
│   │   └── operations/
│   ├── slices/                  # Redux state
│   └── App.jsx
```

---

## 👥 Fonctionnalités par Rôle {#fonctionnalités}

### 🔴 Administrateur

#### 1. Gestion des Quiz
**Description**: Création, modification et suppression de quiz

**Fonctionnalités**:
- ✅ Créer un quiz avec titre, description, et timer
- ✅ Ajouter/modifier/supprimer des questions
- ✅ Définir plusieurs options avec une réponse correcte
- ✅ Visualiser tous les quiz créés
- ✅ Éditer un quiz existant

**Captures techniques**:
```javascript
// Endpoint: POST /api/v1/quizzes
{
  "title": "Droit pénal tunisien",
  "description": "Quiz sur les infractions",
  "timer": 10 // minutes
}
```

#### 2. Gestion des Questions
**Description**: CRUD complet sur les questions

**Fonctionnalités**:
- ✅ Créer des questions à choix multiples
- ✅ Marquer la bonne réponse (vert) / mauvaises (rouge)
- ✅ Modifier les questions existantes
- ✅ Supprimer des questions
- ✅ Validation : au moins une réponse correcte

**Exemple de question**:
```javascript
{
  "questionText": "Quelle est la sanction pour vol aggravé?",
  "options": [
    { "text": "5 ans de prison", "isCorrect": false },
    { "text": "10 ans de prison", "isCorrect": true },
    { "text": "Amende seulement", "isCorrect": false }
  ]
}
```

#### 3. Leaderboard 🏆
**Description**: Vue d'ensemble des performances de tous les utilisateurs

**Informations affichées**:
- 🥇 Classement par coins
- 📊 Score total de chaque utilisateur
- 🎯 Nombre de quiz complétés
- 📅 Date d'inscription
- 📈 Statistiques globales

**Visualisation**:
- Top 3 avec médailles (🥇🥈🥉)
- Code couleur pour le podium
- Statistiques agrégées en bas de page

#### 4. Analyse des Résultats
**Description**: Voir qui a tenté chaque quiz et leurs scores

**Fonctionnalités**:
- ✅ Liste des tentatives par quiz
- ✅ Scores détaillés
- ✅ Horodatage des tentatives
- ✅ Identification des utilisateurs

---

### 🔵 Utilisateur

#### 1. Passage de Quiz
**Description**: Expérience interactive de quiz avec timer

**Fonctionnalités**:
- ✅ Voir tous les quiz disponibles
- ✅ Timer avec compte à rebours
- ✅ 🎵 Son de tick à chaque seconde
- ✅ 🚨 Alerte sonore + visuelle (10 dernières secondes)
- ✅ Sélection de réponses
- ✅ Soumission du quiz

**Expérience utilisateur**:
```
Timer > 10s : Son tick doux toutes les secondes
Timer ≤ 10s : Son d'alerte + timer rouge clignotant
Timer = 0   : Soumission automatique
```

#### 2. Résultats avec Gamification 🎮
**Description**: Feedback immédiat avec animations et récompenses

**Système de récompense**:
- 💰 **10 coins** par bonne réponse
- 🎉 **+50 coins bonus** si 100% de réussite
- 📊 Mise à jour du score total

**Animations selon le score**:
- **100%**: Confettis + 🎉 + son de victoire
- **≥50%**: 😊 + son de succès
- **<50%**: 😢 + son d'échec

**Affichage**:
```
┌─────────────────────────────────┐
│  🎉 Score: 10/10                │
│  💰 Coins gagnés: +150          │
│  (dont +50 bonus)               │
│  Total: 1,250 coins             │
│  ───────────────────────────    │
│  [Barre de progression animée]  │
└─────────────────────────────────┘
```

#### 3. Profil et Statistiques 📊
**Description**: Vue personnalisée des performances

**Informations affichées**:
- 💰 Total de coins (grande carte dorée)
- 🏆 Score total cumulé
- 📈 Nombre de quiz complétés
- 📊 Coins moyens par quiz
- 🎯 Score moyen
- 📈 Taux de réussite estimé

**Design**:
- Carte dorée pour les coins (effet premium)
- Graphiques et statistiques visuelles
- Icônes pour chaque métrique

#### 4. Historique des Tentatives
**Description**: Suivi de toutes les tentatives passées

**Fonctionnalités**:
- ✅ Liste chronologique des quiz passés
- ✅ Scores obtenus
- ✅ Date et heure
- ✅ Badge "Completed" sur les quiz déjà faits
- ✅ Bouton "Attempt Again" pour refaire

---

## 🤖 Intelligence Artificielle & RAG {#ia}

### Vue d'ensemble de la solution IA

L'assistant juridique utilise une architecture **RAG (Retrieval-Augmented Generation)** pour fournir des réponses précises basées sur une base de connaissances juridiques.

### Architecture RAG

```
┌─────────────────────────────────────────────────────────────┐
│                    PIPELINE RAG                              │
└─────────────────────────────────────────────────────────────┘

1. INDEXATION (au démarrage du serveur)
   ┌──────────────┐
   │   MongoDB    │
   │  66 Infrac-  │
   │   tions      │
   └──────┬───────┘
          │
          ↓
   ┌──────────────────────────┐
   │  Préparation Documents   │
   │  - Catégorie             │
   │  - Infraction            │
   │  - Description           │
   │  - Article de loi        │
   │  - Sanctions             │
   │  - Exemples              │
   └──────┬───────────────────┘
          │
          ↓
   ┌──────────────────────────┐
   │   Ollama Embeddings      │
   │   nomic-embed-text       │
   │   Dimension: 768         │
   └──────┬───────────────────┘
          │
          ↓
   ┌──────────────────────────┐
   │   Vector Store           │
   │   Cosine Similarity      │
   │   In-Memory Storage      │
   └──────────────────────────┘

2. REQUÊTE UTILISATEUR (runtime)
   
   Question Utilisateur
          │
          ↓
   ┌──────────────────────────┐
   │  Génération Embedding    │
   │  nomic-embed-text        │
   └──────┬───────────────────┘
          │
          ↓
   ┌──────────────────────────┐
   │  Recherche Vectorielle   │
   │  Top-3 documents les     │
   │  plus similaires         │
   └──────┬───────────────────┘
          │
          ↓
   ┌──────────────────────────┐
   │  Construction Contexte   │
   │  + Prompt Système        │
   └──────┬───────────────────┘
          │
          ↓
   ┌──────────────────────────┐
   │  Génération Réponse      │
   │  Ollama LLaMA 3.2        │
   │  Streaming SSE           │
   └──────┬───────────────────┘
          │
          ↓
   ┌──────────────────────────┐
   │  Interface Utilisateur   │
   │  + Sources citées        │
   └──────────────────────────┘
```

### Composants de l'IA

#### 1. Base de Connaissances
**Source**: 66 infractions juridiques tunisiennes

**Structure des données**:
```javascript
{
  "id": 1,
  "categorie": "Crimes contre les personnes",
  "infraction": "Homicide volontaire",
  "description": "Le fait de donner volontairement la mort...",
  "article": "Art. 201",
  "sanction_prison": "Réclusion à perpétuité",
  "sanction_amende": "",
  "aggravation": "Préméditation, torture...",
  "mots_cles": ["meurtre", "homicide", "tuer"],
  "exemples": ["Meurtre avec préméditation", "Assassinat"]
}
```

#### 2. Embeddings Model
**Modèle**: `nomic-embed-text:latest`
- Convertit le texte en vecteurs de 768 dimensions
- Optimisé pour la recherche sémantique
- Support multilingue (français)

**Processus**:
```javascript
const embedding = await ollama.embeddings({
  model: 'nomic-embed-text:latest',
  prompt: "Qu'est-ce qu'un vol aggravé?"
});
// Résultat: [0.234, -0.123, 0.456, ..., 0.789] (768 valeurs)
```

#### 3. Vector Search
**Algorithme**: Similarité cosinus

**Formule**:
```
similarity(A, B) = (A · B) / (||A|| × ||B||)
```

**Code**:
```javascript
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
```

#### 4. LLM (Large Language Model)
**Modèle**: `llama3.2:latest`
- Génération de texte en français
- Contexte de 8k tokens
- Streaming pour UX réactive

**Prompt Engineering**:
```javascript
const systemPrompt = `Tu es un assistant juridique spécialisé 
dans le droit tunisien.

Contexte juridique pertinent:
${contexteRecuperé}

Instructions:
- Réponds de manière claire et précise
- Cite les articles de loi pertinents
- Si l'information n'est pas dans le contexte, dis-le clairement
- Reste professionnel et objectif`;
```

### Fonctionnalités du Chatbot

#### Interface Utilisateur
- 🎨 **Design moderne**: Fenêtre flottante avec icône robot
- 💬 **Chat en temps réel**: Streaming des réponses
- 📚 **Sources citées**: Affichage des articles utilisés
- 🔄 **Historique**: Contexte conversationnel maintenu
- 🎯 **UX fluide**: Animations de typing

#### Exemples de Questions/Réponses

**Question 1**:
```
User: "Qu'est-ce qu'un vol aggravé?"

Chatbot: "Un vol aggravé est une infraction punie plus 
sévèrement qu'un vol simple en raison de circonstances 
aggravantes telles que:

- Vol avec effraction
- Vol de nuit
- Vol commis par plusieurs personnes

Selon l'Article 264 du code pénal tunisien, le vol aggravé 
est puni de 5 ans d'emprisonnement et d'une amende de 
5000 dinars.

📚 Sources:
- Crimes contre les biens - Vol - Art. 264"
```

**Question 2**:
```
User: "Quelle est la sanction pour conduite en état d'ivresse?"

Chatbot: "La conduite en état d'ivresse est sanctionnée par:

Prison: 6 mois à 2 ans
Amende: 1000 à 3000 dinars

Les circonstances aggravantes incluent:
- Récidive
- Accident causé

Cette infraction est définie dans l'Article 194 du Code 
de la route tunisien.

📚 Sources:
- Infractions routières - Conduite en état d'ivresse - Art. 194"
```

### Avantages de cette Approche RAG

✅ **Précision**: Répond uniquement avec des informations vérifiées
✅ **Traçabilité**: Sources citées pour chaque réponse
✅ **Scalabilité**: Facile d'ajouter de nouvelles infractions
✅ **Performance**: Recherche vectorielle rapide
✅ **Sécurité**: Pas d'hallucinations, données contrôlées
✅ **Maintenance**: Base de connaissances séparée du modèle

---

## 🛠️ Technologies Utilisées {#technologies}

### Backend
| Technologie | Usage | Version |
|-------------|-------|---------|
| Node.js | Runtime JavaScript | 22.19.0 |
| Express.js | Framework web | 4.x |
| MongoDB | Base de données NoSQL | 7.x |
| Mongoose | ODM pour MongoDB | 8.x |
| JWT | Authentification | 9.x |
| bcrypt | Hashage mots de passe | 5.x |
| **Ollama** | **Serveur LLM local** | **0.1.35** |

### Frontend
| Technologie | Usage | Version |
|-------------|-------|---------|
| React | UI Library | 18.x |
| Vite | Build tool | 5.x |
| TailwindCSS | Styling | 3.x |
| Redux Toolkit | State management | 2.x |
| React Router | Navigation | 6.x |
| Axios | HTTP client | 1.x |
| react-confetti | Animations célébration | Latest |
| react-icons | Icônes | Latest |
| date-fns | Formatage dates | Latest |

### Intelligence Artificielle
| Composant | Description |
|-----------|-------------|
| **Ollama** | Serveur LLM local open-source |
| **llama3.2** | Modèle de langage (8B paramètres) |
| **nomic-embed-text** | Modèle d'embeddings (768 dim) |
| **RAG Pipeline** | Architecture custom |
| **Vector Search** | Similarité cosinus in-memory |

---

## 📊 Diagrammes et Schémas {#diagrammes}

### Diagramme de Flux - Passage de Quiz

```
┌─────────────┐
│   START     │
│  Utilisateur│
│ sélectionne │
│    Quiz     │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│ Affichage Quiz   │
│ - Titre          │
│ - Description    │
│ - Timer          │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐    NO
│ Bouton "Start" ◄─┼───────┐
│     cliqué ?     │       │
└──────┬───────────┘       │
       │ YES               │
       ↓                   │
┌──────────────────┐       │
│ Timer démarre    │       │
│ 🎵 Son tick      │       │
└──────┬───────────┘       │
       │                   │
       ↓                   │
┌──────────────────┐       │
│ Affichage        │       │
│ Questions        │       │
│ - Options        │       │
│ - Radio buttons  │       │
└──────┬───────────┘       │
       │                   │
       ↓                   │
┌──────────────────┐       │
│ Timer > 10s ?    │       │
└──────┬───────────┘       │
       │                   │
   YES │    NO             │
       │     │             │
       │     ↓             │
       │  ┌────────────┐   │
       │  │ Timer ≤ 10s│   │
       │  │ 🚨 Alerte  │   │
       │  │ Rouge + Son│   │
       │  └─────┬──────┘   │
       │        │          │
       ↓        ↓          │
┌──────────────────┐       │
│ Timer = 0 ?      │       │
└──────┬───────────┘       │
       │                   │
   NO  │    YES            │
       │     │             │
       │     ↓             │
       │  ┌────────────┐   │
       │  │  Soumission│   │
       │  │  Auto      │   │
       │  └─────┬──────┘   │
       │        │          │
       ↓        │          │
┌──────────────────┐       │
│ Utilisateur      │       │
│ clique "Submit" ?│       │
└──────┬───────────┘       │
       │ YES               │
       ↓                   │
┌──────────────────┐       │
│ Calcul Score     │       │
│ - Vérification   │       │
│ - Coins gagnés   │       │
└──────┬───────────┘       │
       │                   │
       ↓                   │
┌──────────────────┐       │
│ Score = 100% ?   │       │
└──────┬───────────┘       │
       │                   │
   YES │    NO             │
       │     │             │
       ↓     ↓             │
  ┌─────┐ ┌─────┐          │
  │🎉   │ │Score│          │
  │Conf-│ │≥50%?│          │
  │etti │ └──┬──┘          │
  │+50  │    │             │
  │bonus│YES │  NO         │
  └──┬──┘    │   │         │
     │       ↓   ↓         │
     │    ┌───┐┌───┐       │
     │    │😊 ││😢 │       │
     │    │Suc││Fai│       │
     │    │ces││lur│       │
     │    └─┬─┘└─┬─┘       │
     └──────┴───┴─────────┘
            │
            ↓
     ┌──────────────┐
     │ Page Results │
     │ - Score      │
     │ - Coins      │
     │ - Animations │
     └──────┬───────┘
            │
            ↓
         [END]
```

### Diagramme de Séquence - Chatbot IA

```
User          Frontend       Backend        Ollama      MongoDB
 │                │             │              │           │
 │ Tape question  │             │              │           │
 ├──────────────> │             │              │           │
 │                │ POST /chat  │              │           │
 │                ├───────────> │              │           │
 │                │             │ Get embedding│           │
 │                │             ├─────────────>│           │
 │                │             │<─────────────┤           │
 │                │             │  [768 float] │           │
 │                │             │              │           │
 │                │             │ Find top-3   │           │
 │                │             │ similar docs │           │
 │                │             ├─────────────────────────>│
 │                │             │<─────────────────────────┤
 │                │             │   [3 documents]          │
 │                │             │              │           │
 │                │             │ Generate     │           │
 │                │             │ with context │           │
 │                │             ├─────────────>│           │
 │                │             │              │           │
 │                │             │ [Streaming]  │           │
 │                │<────────────┤<─────────────┤           │
 │<───────────────┤  SSE chunks │              │           │
 │  Mot par mot   │             │              │           │
 │                │             │              │           │
 │                │             │ [Done]       │           │
 │                │<────────────┤              │           │
 │<───────────────┤ + Sources   │              │           │
 │  Affichage     │             │              │           │
 │  sources       │             │              │           │
```

### Schéma Base de Données

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ _id: ObjectId       │
│ username: String    │
│ email: String       │
│ password: String    │
│ role: String        │
│ coins: Number       │◄────────┐
│ totalScore: Number  │         │
│ quizzesCompleted: N │         │
│ attemptedQuizes: [] │         │
│ createdAt: Date     │         │
└──────────┬──────────┘         │
           │                    │
           │ 1:N                │
           │                    │
           ↓                    │
┌─────────────────────┐         │
│      Quizzes        │         │
├─────────────────────┤         │
│ _id: ObjectId       │         │
│ title: String       │         │
│ description: String │         │
│ timer: Number       │         │
│ createdBy: ObjectId │         │
│ createdAt: Date     │         │
└──────────┬──────────┘         │
           │                    │
           │ 1:N                │
           │                    │
           ↓                    │
┌─────────────────────┐         │
│     Questions       │         │
├─────────────────────┤         │
│ _id: ObjectId       │         │
│ quizId: ObjectId    │         │
│ questionText: String│         │
│ options: [          │         │
│   {                 │         │
│     text: String    │         │
│     isCorrect: Bool │         │
│   }                 │         │
│ ]                   │         │
└──────────┬──────────┘         │
           │                    │
           │ N:N                │
           │                    │
           ↓                    │
┌─────────────────────┐         │
│      Attempts       │         │
├─────────────────────┤         │
│ _id: ObjectId       │         │
│ userId: ObjectId    ├─────────┘
│ quizId: ObjectId    │
│ score: Number       │
│ answers: [          │
│   {                 │
│     questionId      │
│     selectedOption  │
│   }                 │
│ ]                   │
│ completedAt: Date   │
└─────────────────────┘

┌─────────────────────┐
│    Infractions      │ (Pour l'IA)
├─────────────────────┤
│ _id: ObjectId       │
│ categorie: String   │
│ infraction: String  │
│ description: String │
│ article: String     │
|_____________________|

---

##  R�sum� du Projet

**QUIZZY** est une solution compl�te de gamification p�dagogique combinant quiz interactif et IA juridique.

###  **Objectifs Atteints**
 Plateforme de quiz interactive et engageante
 Assistant IA juridique bas� sur RAG
 Syst�me de gamification avec coins et leaderboard
 Exp�rience utilisateur immersive avec animations et sons
 Architecture scalable et maintenable

###  **Cas d'Usage**
-  **Education Juridique** : Plateforme pour apprendre le droit tunisien
-  **Formation Institutionnelle** : Modules de formation pour organismes publics
-  **E-Learning** : Quiz d'�valuation avec feedback imm�diat
-  **Support IA** : Assistant juridique accessible 24/7

###  **Stack Technologique**
- **Frontend** : React 18 + Vite + TailwindCSS + Redux
- **Backend** : Node.js + Express + MongoDB
- **IA** : Ollama + llama3.2 + nomic-embed-text (RAG)
- **Architecture** : MERN Stack + AI Integration

###  **Fonctionnalit�s Cl�s**
1. **Quiz Interactif** : Timer avec notifications sonores
2. **Gamification** : Coins, classement, r�compenses
3. **Chatbot IA** : Questions juridiques avec sources cit�es
4. **Admin Dashboard** : Gestion compl�te des quiz
5. **Leaderboard** : Classement global des utilisateurs

###  **S�curit� & Performance**
- Authentification JWT avec hashage bcrypt
- Validation des donn�es c�t� serveur
- Recherche vectorielle optimis�e
- Cache des embeddings pour performance
- CORS et headers de s�curit�

###  **Statistiques du Projet**
- **66 infractions juridiques** pr�-charg�es
- **768 dimensions** pour les embeddings
- **8K tokens** de contexte LLM
- **Support multilingue** (fran�ais)
- **Temps de r�ponse** : < 2 secondes

###  **Concepts Avanc�s Impl�ment�s**
- RAG Pipeline complet
- Vector Search avec similarit� cosinus
- Streaming SSE pour UX r�active
- State Management avec Redux
- Component-based Architecture
- RESTful API Design

###  **Potentiel de Croissance**
- Extension � d'autres domaines (commerce, finance, etc.)
- Mobile app avec React Native
- Int�gration avec LMS (Moodle, Canvas)
- Webhooks et API publique
- Multi-langue support (AR, EN, FR)
- Analyse pr�dictive des performances

###  **Points Forts du Projet**
 **Innovation** : Combinaison unique de quiz + IA juridique
 **Exp�rience UX** : Interface fluide et r�active
 **Scalabilit�** : Architecture extensible et modulaire
 **Documentation** : Code bien comment� et organis�
 **Open Source** : Licence MIT, contributions bienvenues

---

###  **Merci d'utiliser QUIZZY !**

Pour toute question, suggestion ou bug : **support@quizzy.com**

**Fabriqu� avec  par l'�quipe QUIZZY**

*Derni�re mise � jour : 17 janvier 2026*
