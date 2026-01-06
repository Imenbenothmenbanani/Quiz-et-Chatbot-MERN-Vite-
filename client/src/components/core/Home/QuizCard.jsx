import { useEffect, useState } from 'react';
import React from 'react'
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux';

const QuizCard = ({ quiz }) => {

    const [attempted, setAttempted] = useState(false)
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        setAttempted(user?.attemptedQuizzes?.includes(quiz._id) ? true : false)
    }, [user, quiz._id])

    // Vérifier que l'ID du quiz est valide
    if (!quiz || !quiz._id) {
        console.error("❌ Quiz sans ID:", quiz);
        return null; // Ne pas afficher la carte si pas d'ID
    }

    return (
        <Link 
            to={`/quiz/${quiz._id}`} 
            className='border border-slate-600 bg-slate-900 p-3 rounded-lg relative overflow-hidden hover:border-slate-400 transition-all duration-300'
        >
            <h2 className='text-xl line-clamp-2 border-b border-slate-600 pb-3 mb-2'>
                {quiz.title || 'Quiz sans titre'}
            </h2>
            <span className='font-thin'>
                <p className='line-clamp-2'>{quiz.description || 'Pas de description'}</p>
                <span className='flex gap-3'>
                    <p>{quiz.createdBy?.username || 'Inconnu'}</p>
                    |
                    {quiz.createdAt && (
                        <p>{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}</p>
                    )}
                </span>
            </span>

            <span className='absolute top-[10%] right-[-10%] rotate-[30deg]'>
                {
                    attempted && (
                        <span className='bg-green-600 text-white px-10 py-1 text-sm'>Completed</span>
                    )
                }
            </span>
        </Link>
    )
}

export default QuizCard