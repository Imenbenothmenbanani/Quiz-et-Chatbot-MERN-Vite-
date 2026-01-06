import { useEffect, useState } from 'react'
import React from 'react'
import { apiConnector } from "../services/apiConnector"
import { useNavigate, useParams } from 'react-router-dom'
import { questionEndpoints, quizEndpoints } from '../services/APIs'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import QuizQuestions from '../components/core/attemptQuiz/QuizQuestions'

const AttemptQuiz = () => {

    const [quizDetails, setQuizDetails] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useSelector(state => state.auth)
    const navigate = useNavigate();

    const { id: quizId } = useParams();

    // Vérifier que l'ID du quiz est valide
    useEffect(() => {
        if (!quizId || quizId === 'undefined') {
            console.error("❌ ID de quiz invalide:", quizId);
            setError("ID de quiz invalide");
            setDetailsLoading(false);
            setQuestionsLoading(false);
            return;
        }
    }, [quizId]);

    const fetchQuizQuestions = async () => {
        if (!quizId || quizId === 'undefined') return;
        
        setQuestionsLoading(true);
        try {
            const response = await apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${quizId}`, null, {
                Authorization: `Bearer ${token}`
            })

            console.log("QUIZ QUESTIONS RESPONSE : ", response)

            setQuizQuestions(response?.data?.data);
        } catch (error) {
            console.log('Error fetching quiz questions:', error);
            setError("Erreur lors du chargement des questions");
        } finally {
            setQuestionsLoading(false);
        }
    };

    const fetchQuizDetails = async () => {
        if (!quizId || quizId === 'undefined') return;
        
        try {
            setDetailsLoading(true);
            const response = await apiConnector("GET", `${quizEndpoints.GET_QUIZ_DETAILS}/${quizId}`, null, {
                Authorization: `Bearer ${token}`
            })

            console.log("QUIZ DETAILS RESPONSE : ", response)

            setQuizDetails(response?.data?.data);
        } catch (error) {
            console.log('Error fetching quiz details:', error);
            setError("Erreur lors du chargement du quiz");
        } finally {
            setDetailsLoading(false);
        }
    };

    useEffect(() => {
        if (quizId && quizId !== 'undefined') {
            fetchQuizDetails();
            fetchQuizQuestions();
        }
    }, [quizId]);

    // Afficher une erreur si l'ID est invalide
    if (error || quizId === 'undefined' || !quizId) {
        return (
            <section className='min-h-[90vh] py-10 flex flex-col items-center justify-center'>
                <div className='border py-10 px-5 rounded-lg bg-slate-900 border-slate-600 text-center'>
                    <h1 className='text-3xl text-red-500 mb-5'>⚠️ Erreur</h1>
                    <p className='text-xl mb-5'>{error || "Quiz non trouvé"}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className='bg-green-700 hover:bg-green-800 px-6 py-2 rounded-lg transition-all'
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className='min-h-[90vh] py-10'>
            <div className='border py-3 px-5 rounded-lg bg-slate-900 border-slate-600'>
                {
                    questionsLoading || detailsLoading ? <h1>Loading...</h1> :
                        <>
                            <span className='flex flex-col md:flex-row gap-x-5 gap-y-1 items-center justify-between font-thin mb-3'>
                                <h3 className='text-base md:text-2xl font-semibold line-clamp-2'>
                                    {quizDetails?.title || 'Quiz'}
                                </h3>
                                <p className='text-slate-300 w-fit text-nowrap'>
                                    Time : {quizDetails?.timer || 0} minutes
                                </p>
                            </span>
                            <span className='flex flex-col md:flex-row justify-between items-center gap-x-5 gap-y-1 font-thin'>
                                <p className='font-thin mt-1 line-clamp-2'>
                                    {quizDetails?.description || ''} 
                                </p>
                                <span className='flex gap-3 text-slate-300 w-fit text-nowrap'>
                                    <p>créé par - {quizDetails?.createdBy?.username || 'Inconnu'}</p>
                                    {quizDetails?.createdAt && (
                                        <p>{formatDistanceToNow(new Date(quizDetails.createdAt), { addSuffix: true })}</p>
                                    )}
                                </span>
                            </span>
                        </>
                }
            </div>
            <div>
                {!questionsLoading && !detailsLoading && quizDetails && quizQuestions && (
                    <QuizQuestions quizDetails={quizDetails} quizQuestions={quizQuestions} />
                )}
            </div>
        </section>
    )
}

export default AttemptQuiz