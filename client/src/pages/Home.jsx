import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from "../services/APIs/index"
import QuizCard from '../components/core/Home/QuizCard'

const Home = () => {

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useSelector(state => state.auth)

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", quizEndpoints.GET_ALL_QUIZES, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // Filtrer les quiz sans _id valide
      const validQuizzes = response.data.data.filter(quiz => quiz && quiz._id);
      
      console.log("📚 Quiz chargés:", validQuizzes.length);
      if (validQuizzes.length !== response.data.data.length) {
        console.warn("⚠️ Certains quiz n'ont pas d'ID valide et ont été filtrés");
      }

      setQuizzes(validQuizzes);

    } catch (e) {
      console.error("❌ Erreur lors du chargement des quiz:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, [])

  return (
    <section className='min-h-[90vh] border-t border-slate-600 py-5 mt-3'>
      {
        loading ? (
          <div className='text-center min-h-[90vh] flex items-center justify-center text-xl'>
            Loading...
          </div>
        ) : !loading && quizzes?.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3'>
            {
              quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))
            }
          </div>
        ) : (
          <div className='text-center min-h-[90vh] flex items-center justify-center text-xl'>
            <div>
              <p className='text-2xl mb-4'>Aucun quiz disponible</p>
              <p className='text-slate-400'>Les administrateurs peuvent créer des quiz dans le dashboard</p>
            </div>
          </div>
        )
      }
    </section>
  )
}

export default Home