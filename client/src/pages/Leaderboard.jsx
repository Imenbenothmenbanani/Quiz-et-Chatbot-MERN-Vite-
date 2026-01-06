import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../services/apiConnector';
import { quizEndpoints } from '../services/APIs';
import { formatDistanceToNow } from 'date-fns';
import { FaTrophy, FaMedal, FaCoins } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector(state => state.auth);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        'GET',
        quizEndpoints.GET_LEADERBOARD,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setLeaderboard(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-400 text-3xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-3xl" />;
    if (rank === 3) return <FaMedal className="text-orange-600 text-3xl" />;
    return <span className="text-2xl font-bold text-slate-400">#{rank}</span>;
  };

  const getRankBgColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-600 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-600 to-orange-400';
    return 'bg-slate-800';
  };

  return (
    <section className="py-5 min-h-[calc(100vh-10rem)]">
      <div className="bg-slate-900 border-slate-600 border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-6">
          <FaTrophy className="text-yellow-400 text-4xl" />
          <h1 className="text-3xl font-bold">Classement des Joueurs</h1>
        </div>

        {loading ? (
          <div className="text-center text-xl py-20">Chargement...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-xl py-20">Aucun joueur trouvé</div>
        ) : (
          <div className="space-y-3">
            {/* En-tête du tableau */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-slate-800 rounded-lg font-semibold border border-slate-600">
              <div>Rang</div>
              <div>Joueur</div>
              <div className="text-center">Coins</div>
              <div className="text-center">Score Total</div>
              <div className="text-center">Quiz Complétés</div>
              <div className="text-center">Membre depuis</div>
            </div>

            {/* Liste des joueurs */}
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`grid grid-cols-1 md:grid-cols-6 gap-4 p-5 rounded-lg border border-slate-600 ${getRankBgColor(
                  user.rank
                )} hover:scale-[1.02] transition-transform duration-200`}
              >
                {/* Rang */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  {getRankIcon(user.rank)}
                </div>

                {/* Joueur */}
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-lg">{user.username}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>

                {/* Coins */}
                <div className="flex items-center justify-center gap-2">
                  <FaCoins className="text-yellow-400 text-xl" />
                  <span className="text-2xl font-bold text-yellow-400">
                    {user.coins}
                  </span>
                </div>

                {/* Score Total */}
                <div className="flex items-center justify-center">
                  <span className="text-xl font-semibold text-green-400">
                    {user.totalScore}
                  </span>
                </div>

                {/* Quiz Complétés */}
                <div className="flex items-center justify-center">
                  <span className="text-xl font-semibold">{user.quizzesCompleted}</span>
                </div>

                {/* Membre depuis */}
                <div className="flex items-center justify-center text-sm text-slate-300">
                  {formatDistanceToNow(new Date(user.memberSince), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques globales */}
        {!loading && leaderboard.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-600 text-center">
              <p className="text-slate-400 text-sm mb-2">Total Joueurs</p>
              <p className="text-3xl font-bold text-blue-400">{leaderboard.length}</p>
            </div>
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-600 text-center">
              <p className="text-slate-400 text-sm mb-2">Total Coins Distribués</p>
              <p className="text-3xl font-bold text-yellow-400">
                {leaderboard.reduce((sum, user) => sum + user.coins, 0)}
              </p>
            </div>
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-600 text-center">
              <p className="text-slate-400 text-sm mb-2">Total Quiz Complétés</p>
              <p className="text-3xl font-bold text-green-400">
                {leaderboard.reduce((sum, user) => sum + user.quizzesCompleted, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;