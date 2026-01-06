// src/hooks/useSound.js
import { useRef, useCallback, useEffect } from 'react';

export const useSound = () => {
  const audioContextRef = useRef(null);
  const tickSoundRef = useRef(null);

  // Précharger le son de tick
  useEffect(() => {
    tickSoundRef.current = new Audio('/sounds/clock-tick.mp3');
    tickSoundRef.current.volume = 0.5; // Volume à 50%
    
    return () => {
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current = null;
      }
    };
  }, []);

  // Initialiser l'AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Son de tick pour le timer (utilise votre fichier audio)
  const playTick = useCallback(() => {
    if (tickSoundRef.current) {
      // Réinitialiser la position pour rejouer
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current.play().catch(err => {
        console.log("Erreur lecture audio:", err);
      });
    }
  }, []);

  // Son d'alerte pour les 10 dernières secondes
  const playWarning = useCallback(() => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }, [getAudioContext]);

  // Son de succès
  const playSuccess = useCallback(() => {
    const audioContext = getAudioContext();
    const notes = [523.25, 659.25, 783.99]; // C, E, G (accord majeur)

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }, [getAudioContext]);

  // Son d'échec
  const playFailure = useCallback(() => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [getAudioContext]);

  return {
    playTick,
    playWarning,
    playSuccess,
    playFailure
  };
};