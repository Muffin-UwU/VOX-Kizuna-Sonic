'use client';

import React from 'react';
import { useAudio } from '../hooks/useAudio';
import { CommandType } from '@kizuna/types';
import { useAppContext } from '../context/AppContext';

export default function CommandPalette() {
  const { playCommand } = useAudio();
  const { currentCommand, isPlaying } = useAppContext();

  const handlePlay = (cmd: CommandType) => {
    playCommand(cmd);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <button 
        onClick={() => handlePlay('stop')}
        className={`
          flex flex-col items-center justify-center h-48 rounded-2xl shadow-lg transform transition-all active:scale-95
          ${isPlaying && currentCommand === 'stop' 
            ? 'bg-red-500 ring-4 ring-red-300 scale-105' 
            : 'bg-red-700 hover:bg-red-600'}
        `}
        aria-label="Play Stop Command"
      >
        <span className="text-4xl mb-2">🛑</span>
        <span className="text-3xl font-bold text-white">止まれ</span>
        <span className="text-sm text-red-200 mt-1">STOP</span>
      </button>

      <button 
        onClick={() => handlePlay('come')}
        className={`
          flex flex-col items-center justify-center h-48 rounded-2xl shadow-lg transform transition-all active:scale-95
          ${isPlaying && currentCommand === 'come' 
            ? 'bg-green-500 ring-4 ring-green-300 scale-105' 
            : 'bg-green-700 hover:bg-green-600'}
        `}
        aria-label="Play Come Command"
      >
        <span className="text-4xl mb-2">👋</span>
        <span className="text-3xl font-bold text-white">おいで</span>
        <span className="text-sm text-green-200 mt-1">COME</span>
      </button>

      <button 
        onClick={() => handlePlay('danger')}
        className={`
          flex flex-col items-center justify-center h-48 rounded-2xl shadow-lg transform transition-all active:scale-95
          ${isPlaying && currentCommand === 'danger' 
            ? 'bg-yellow-500 ring-4 ring-yellow-300 scale-105' 
            : 'bg-yellow-700 hover:bg-yellow-600'}
        `}
        aria-label="Play Danger Command"
      >
        <span className="text-4xl mb-2">⚠️</span>
        <span className="text-3xl font-bold text-white">危険</span>
        <span className="text-sm text-yellow-200 mt-1">DANGER</span>
      </button>
    </div>
  );
}
