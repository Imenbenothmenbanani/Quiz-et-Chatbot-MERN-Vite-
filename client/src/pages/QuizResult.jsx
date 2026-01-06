import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button'; // ← CORRIGÉ
import Confetti from 'react-confetti';
import { useSound } from '../hooks/useSound';
import { FaCoins } from 'react-icons/fa';

const QuizResults = () => {
    const location = useLocation();
    const { score, total, perfect, failed, coinsEarned, bonusCoins, newTotalCoins } = location.state || { 
      score: 0, 
      total: 0,
      coinsEarned: 0,
      bonusCoins: 0,
      newTotalCoins: 0
    };
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(false);
    const { playSuccess, playFailure } = useSound();
    const percentage = total > 0 ? (score / total) * 100 : 0;

    useEffect(() => {
        // Animations et sons au chargement
        if (perfect) {
            setShowConfetti(true);
            playSuccess();
            setTimeout(() => setShowConfetti(false), 5000);
        } else if (percentage >= 50) {
            playSuccess();
        } else {
            playFailure();
        }
    }, [perfect, percentage, playSuccess, playFailure]);

    // Emoji basé sur le score
    const getEmoji = () => {
        if (perfect) return '🎉';
        if (percentage >= 80) return '😊';
        if (percentage >= 50) return '😐';
        return '😢';
    };

    // Message basé sur le score
    const getMessage = () => {
        if (perfect) return 'Parfait ! 100% de réussite !';
        if (percentage >= 80) return 'Excellent travail !';
        if (percentage >= 50) return 'Bien joué, continue comme ça !';
        return 'Ne vous découragez pas, réessayez !';
    };

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                />
            )}

            <div className='min-h-[80vh] flex flex-col gap-5 justify-center items-center'>
                <div className='text-center max-w-2xl'>
                    {/* Emoji animé */}
                    <div className={`text-9xl mb-5 ${
                        perfect ? 'animate-bounce' : 
                        failed ? 'animate-pulse' : 
                        'animate-wiggle'
                    }`}>
                        {getEmoji()}
                    </div>

                    <h1 className='text-3xl border-b border-slate-600 pb-5 mb-5'>
                        Résultats du Quiz
                    </h1>

                    {/* Message personnalisé */}
                    <p className='text-2xl mb-5 text-green-400 font-semibold'>
                        {getMessage()}
                    </p>

                    {/* Score avec animation */}
                    <div className='bg-slate-800 p-8 rounded-lg border border-slate-600 mb-5'>
                        <p className='text-xl mb-3 font-thin'>Votre Score :</p>
                        <div className='flex items-center justify-center gap-3'>
                            <span className={`text-6xl font-bold ${
                                percentage >= 50 ? 'text-green-500' : 'text-red-700'
                            } animate-pulse`}>
                                {score}
                            </span>
                            <span className='text-4xl text-slate-400'>/</span>
                            <span className='text-4xl font-semibold text-slate-300'>
                                {total}
                            </span>
                        </div>
                        <div className='mt-4'>
                            <div className='w-full bg-slate-700 rounded-full h-4 overflow-hidden'>
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                        percentage >= 50 ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p className='text-lg mt-2 text-slate-400'>
                                {percentage.toFixed(0)}% de réussite
                            </p>
                        </div>
                    </div>

                    {/* Badges de réussite */}
                    {perfect && (
                        <div className='bg-gradient-to-r from-yellow-600 to-yellow-400 text-black p-4 rounded-lg mb-5 animate-pulse'>
                            <span className='text-2xl'>🏆 Score Parfait ! 🏆</span>
                        </div>
                    )}

                    {/* Affichage des coins gagnés */}
                    {coinsEarned > 0 && (
                        <div className='bg-gradient-to-r from-green-600 to-green-400 p-6 rounded-lg mb-5 animate-fadeInUp'>
                            <div className='flex items-center justify-center gap-3 mb-3'>
                                <FaCoins className='text-yellow-300 text-5xl animate-bounce' />
                                <div className='text-center'>
                                    <p className='text-white text-xl font-semibold mb-1'>Coins Gagnés !</p>
                                    <p className='text-white text-4xl font-bold'>+{coinsEarned}</p>
                                    {bonusCoins > 0 && (
                                        <p className='text-yellow-300 text-lg mt-1'>
                                            (dont +{bonusCoins} bonus 🎉)
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className='text-center text-white text-sm'>
                                Total de coins: {newTotalCoins}
                            </div>
                        </div>
                    )}
                </div>

                <Button className='w-max' onClick={() => navigate("/")}>
                    Retour à l'accueil
                </Button>
            </div>
        </>
    );
};

export default QuizResults;