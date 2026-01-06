import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../Button';
import QuestionCard from './QuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { quizEndpoints } from "../../../services/APIs";
import { setUser } from "../../../slices/AuthSlice";
import { useSound } from '../../../hooks/useSound';
import Confetti from 'react-confetti';

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [alreadyAttempted, setAlreadyAttempted] = useState(false);
    const { token, user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { playTick, playWarning, playSuccess, playFailure } = useSound();

    useEffect(() => {
        if (quizDetails?.timer) {
            setRemainingTime(quizDetails.timer * 60);
        }
    }, [quizDetails]);

    // Vérifier si l'utilisateur a déjà tenté ce quiz
    useEffect(() => {
        if (quizDetails && user) {
            const hasAttempted = user.attemptedQuizzes?.includes(quizDetails._id);
            setAlreadyAttempted(hasAttempted);
            
            if (hasAttempted) {
                console.log("⚠️ Quiz déjà tenté par l'utilisateur");
            }
        }
    }, [quizDetails, user]);

    // Gestion du timer avec sons
    useEffect(() => {
        let timer;
        if (quizStarted && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => {
                    const newTime = prevTime - 1;
                    
                    // Jouer le son à chaque seconde
                    playTick();
                    
                    // Son d'alerte supplémentaire pour les 10 dernières secondes
                    if (newTime <= 10 && newTime > 0) {
                        playWarning();
                    }
                    
                    return newTime;
                });
            }, 1000);
        } else if (quizStarted && remainingTime === 0) {
            clearInterval(timer);
            alert('Time is up!');
            submitQuiz();
        }
        return () => clearInterval(timer);
    }, [quizStarted, remainingTime, playTick, playWarning]);

    const handleAnswerChange = useCallback((questionId, selectedOption) => {
        setUserAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(
                (answer) => answer.questionId === questionId
            );
            if (existingAnswerIndex >= 0) {
                prevAnswers[existingAnswerIndex].selectedOption = selectedOption;
            } else {
                prevAnswers.push({ questionId, selectedOption });
            }
            return [...prevAnswers];
        });
    }, []);

    const startQuiz = () => {
        setQuizStarted(true);
        playTick(); // Son au démarrage
    };

    const submitQuiz = async () => {
        try {
            const response = await apiConnector(
                'POST',
                `${quizEndpoints.ATTEMMP_QUIZ}/${quizDetails._id}/attempt`,
                {
                    quizId: quizDetails._id,
                    answers: userAnswers,
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            );
            
            dispatch(setUser({ 
                ...user, 
                attemptedQuizzes: [...(user.attemptedQuizzes || []), quizDetails._id] 
            }));

            const score = response.data.score;
            const total = quizQuestions?.length;
            const percentage = (score / total) * 100;
            const coinsEarned = response.data.coinsEarned || 0;
            const bonusCoins = response.data.bonusCoins || 0;
            const newTotalCoins = response.data.newTotalCoins || 0;

            // Jouer le son et afficher l'animation appropriée
            if (percentage === 100) {
                // Toutes les réponses correctes
                playSuccess();
                setShowCelebration(true);
                setTimeout(() => {
                    navigate('/quiz-results', { 
                        state: { 
                            score, 
                            total, 
                            perfect: true,
                            coinsEarned,
                            bonusCoins,
                            newTotalCoins
                        } 
                    });
                }, 3000);
            } else if (percentage >= 50) {
                // Plus de la moitié correcte
                playSuccess();
                navigate('/quiz-results', { 
                    state: { 
                        score, 
                        total, 
                        perfect: false,
                        coinsEarned,
                        bonusCoins,
                        newTotalCoins
                    } 
                });
            } else {
                // Moins de la moitié correcte
                playFailure();
                navigate('/quiz-results', { 
                    state: { 
                        score, 
                        total, 
                        failed: true,
                        coinsEarned,
                        bonusCoins,
                        newTotalCoins
                    } 
                });
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            playFailure();
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            {showCelebration && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}
            
            <div className='flex py-5 border min-h-[70vh] px-5 justify-center items-start mt-5 rounded-lg bg-slate-900 border-slate-600'>
                {!quizStarted ? (
                    <div className='flex flex-col items-center gap-5'>
                        {alreadyAttempted && (
                            <div className='bg-yellow-900 border border-yellow-600 text-yellow-200 px-6 py-3 rounded-lg text-center'>
                                <p className='text-xl font-semibold mb-2'>⚠️ Quiz déjà tenté</p>
                                <p className='text-sm'>Vous avez déjà passé ce quiz. Vous pouvez le refaire pour vous entraîner, mais votre score ne sera pas comptabilisé.</p>
                            </div>
                        )}
                        <Button className='w-max self-center' onClick={startQuiz}>
                            {alreadyAttempted ? 'Recommencer (Entraînement)' : 'Start Quiz'}
                        </Button>
                    </div>
                ) : (
                    <div className='w-full flex flex-col'>
                        <h2 className={`border border-slate-600 py-2 px-3 rounded-lg text-center md:text-end transition-all duration-300 ${
                            remainingTime <= 10 ? 'bg-red-900 animate-pulse' : ''
                        }`}>
                            Time Remaining: 
                            <span className={`ml-2 font-bold ${
                                remainingTime <= 10 ? 'text-red-300 text-2xl' : 'text-red-500'
                            }`}>
                                {formatTime(remainingTime)}
                            </span>
                        </h2>
                        <div className='min-h-[50vh]'>
                            {quizQuestions && quizQuestions.map((ques) => (
                                <QuestionCard
                                    key={ques._id}
                                    question={ques}
                                    onAnswerChange={handleAnswerChange}
                                />
                            ))}
                        </div>
                        <Button className='w-max self-end' onClick={submitQuiz}>Submit</Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default QuizQuestions;