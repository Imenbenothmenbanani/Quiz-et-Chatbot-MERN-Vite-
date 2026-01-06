import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Button from "../components/Button";
import { FaHome, FaCoins, FaTrophy } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <section className='py-5 px-3 md:p-10 min-h-[calc(100vh-10rem)] bg-slate-900 border-slate-600 border rounded-lg flex flex-col gap-y-5 items-start justify-start'>
      <h1 className='text-2xl md:text-4xl text-white font-semibold'>Profile</h1>
      
      {/* Carte des Coins */}
      <div className='w-full bg-gradient-to-r from-yellow-600 to-yellow-400 py-8 px-5 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-black text-sm mb-2'>Vos Coins</p>
            <div className='flex items-center gap-3'>
              <FaCoins className='text-black text-5xl' />
              <span className='text-6xl font-bold text-black'>{user.coins || 0}</span>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-black text-sm'>Score Total</p>
            <p className='text-4xl font-bold text-black'>{user.totalScore || 0}</p>
            <p className='text-black text-sm mt-2'>Quiz Complétés</p>
            <p className='text-2xl font-bold text-black'>{user.quizzesCompleted || 0}</p>
          </div>
        </div>
      </div>

      {/* Informations du profil */}
      <div className='w-full bg-slate-800 py-5 px-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-base md:text-xl rounded-lg border border-slate-600'>
        <h2>Username : <span className='font-thin'>{user.username}</span></h2>
        <p>Email : <span className='font-thin'>{user.email}</span></p>
        <p>Joined : <span className='font-thin'>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span></p>
        <p>Role : <span className='font-thin'>{user.role}</span></p>
      </div>

      {/* Statistiques */}
      <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-slate-800 p-5 rounded-lg border border-slate-600 text-center'>
          <FaCoins className='text-yellow-400 text-3xl mx-auto mb-2' />
          <p className='text-slate-400 text-sm'>Coins par Quiz</p>
          <p className='text-2xl font-bold'>
            {user.quizzesCompleted > 0 
              ? Math.round((user.coins || 0) / user.quizzesCompleted)
              : 0}
          </p>
        </div>
        <div className='bg-slate-800 p-5 rounded-lg border border-slate-600 text-center'>
          <FaTrophy className='text-green-400 text-3xl mx-auto mb-2' />
          <p className='text-slate-400 text-sm'>Score Moyen</p>
          <p className='text-2xl font-bold'>
            {user.quizzesCompleted > 0
              ? ((user.totalScore || 0) / user.quizzesCompleted).toFixed(1)
              : 0}
          </p>
        </div>
        <div className='bg-slate-800 p-5 rounded-lg border border-slate-600 text-center'>
          <p className='text-slate-400 text-sm mb-2'>Taux de Réussite</p>
          <p className='text-2xl font-bold text-blue-400'>
            {user.quizzesCompleted > 0 ? '~' : ''}
            {user.quizzesCompleted > 0
              ? Math.round(((user.totalScore || 0) / (user.quizzesCompleted * 10)) * 100)
              : 0}%
          </p>
        </div>
      </div>

      <div className='w-full min-h-[20vh] grid place-content-center'>
        <Button onClick={() => navigate('/')} className='w-max flex gap-3 items-center py-2'>
          <FaHome /> Return to Home
        </Button>
      </div>
    </section>
  );
};

export default Profile;