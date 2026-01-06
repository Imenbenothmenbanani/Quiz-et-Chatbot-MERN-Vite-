const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");

// ✅
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, timer } = req.body;
    const user = req.user;

    if (!title || !description || !timer) {
      return res.status(400).json({
        success: false,
        error: "Please provide all the required fields",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      timer,
      createdBy: user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR CREATING QUIZ: ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, timer } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    quiz.title = title;
    quiz.description = description;
    quiz.timer = timer;

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR UPDATING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quizId });

    for (const question of questions) {
      await Question.findByIdAndDelete(question._id);
    }

    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (e) {
    console.log("ERROR DELETING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username email");
    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZZES : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).populate(
      "createdBy",
      "username email"
    );
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

/// ✅ CORRIGÉ
exports.attemptQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, answers } = req.body;

    console.log("📝 Tentative de quiz:", { userId, quizId, answersCount: answers.length });

    // Vérifier que le quiz existe
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // ⚠️ CORRECTION ICI : utiliser quizId au lieu de quiz
    const questions = await Question.find({ quizId: quizId });
    
    console.log("📚 Questions trouvées:", questions.length);

    if (questions.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No questions found for this quiz" 
      });
    }

    let score = 0;
    const answersArray = [];

    for (const question of questions) {
      const userAnswer = answers.find(
        (ans) => ans.questionId === question._id.toString()
      );
      
      if (userAnswer) {
        const selectedOption = question.options.id(userAnswer.selectedOption);
        
        console.log("🔍 Question:", question.questionText);
        console.log("   Réponse sélectionnée:", selectedOption?.text);
        console.log("   Est correcte?", selectedOption?.isCorrect);
        
        if (selectedOption && selectedOption.isCorrect) {
          score += 1;
        }
        
        answersArray.push({
          questionId: question._id,
          selectedOption: userAnswer.selectedOption,
        });
      } else {
        // Si l'utilisateur n'a pas répondu
        answersArray.push({
          questionId: question._id,
          selectedOption: null,
        });
      }
    }

    console.log("✅ Score final:", score, "/", questions.length);

    // Calculer les coins gagnés (10 coins par bonne réponse)
    const coinsEarned = score * 10;
    const percentageScore = (score / questions.length) * 100;
    
    // Bonus si score parfait (50 coins bonus)
    const bonusCoins = percentageScore === 100 ? 50 : 0;
    const totalCoinsEarned = coinsEarned + bonusCoins;

    const attempt = new Attempt({
      userId,
      quizId,
      score,
      answers: answersArray,
    });
    await attempt.save();

    // Mettre à jour les statistiques de l'utilisateur
    const user = await User.findById(userId);
    
    // Ajouter le quiz aux quiz tentés (si pas déjà présent)
    if (!user.attemptedQuizes.includes(quizId)) {
      user.attemptedQuizes.push(quizId);
      user.quizzesCompleted += 1;
    }
    
    // Mettre à jour coins et score total
    user.coins += totalCoinsEarned;
    user.totalScore += score;
    
    await user.save();

    console.log("💰 Coins gagnés:", totalCoinsEarned, "(dont bonus:", bonusCoins, ")");

    return res.status(200).json({
      success: true,
      message: "Quiz attempted successfully",
      score,
      totalQuestions: questions.length,
      coinsEarned: totalCoinsEarned,
      bonusCoins: bonusCoins,
      newTotalCoins: user.coins,
    });
  } catch (e) {
    console.error("❌ ERROR ATTEMPTING QUIZ:", e.message);
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id; 

    const attempts = await Attempt.find({ userId }).populate(
      "quizId",
      "title description"
    );

    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (e) {
    console.error("ERROR FETCHING USER ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getAdminQuizes = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ createdBy: userId });

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (e) {
    console.error("ERROR FETCHING ADMIN QUIZZES:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getQuizAttempts = async (req, res) => {
  try {
    const quizId = req.params.id;
    const attempts = await Attempt.find({ quizId }).populate(
      "userId score",
      "username"
    );
    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (e) {
    console.error("ERROR FETCHING QUIZ ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
// ✅ Obtenir le leaderboard (classement des utilisateurs)
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("username email coins totalScore quizzesCompleted createdAt")
      .sort({ coins: -1 }) // Trier par coins décroissant
      .limit(100); // Limiter à 100 utilisateurs

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      email: user.email,
      coins: user.coins,
      totalScore: user.totalScore,
      quizzesCompleted: user.quizzesCompleted,
      memberSince: user.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (e) {
    console.error("ERROR FETCHING LEADERBOARD:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};