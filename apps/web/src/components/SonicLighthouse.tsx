'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function SonicLighthouse() {
  const { lighthouseActive, setLighthouseActive } = useAppContext();

  return (
    <div className="flex items-center justify-between bg-neutral-900 p-6 rounded-3xl w-full max-w-4xl mt-8 border border-neutral-800 shadow-lg">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔦</span>
          <h3 className="text-2xl font-bold text-white">Sonic Lighthouse</h3>
        </div>
        <p className="text-neutral-400 text-sm max-w-md">
          Emits a steady high-frequency ping (15kHz) to help your blind dog navigate the room via echolocation.
        </p>
      </div>
      
      <button 
        onClick={() => setLighthouseActive(!lighthouseActive)}
        className={`
          relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/50
          ${lighthouseActive ? 'bg-blue-600' : 'bg-neutral-700'}
        `}
        aria-label="Toggle Sonic Lighthouse"
      >
        <span className="sr-only">Enable Sonic Lighthouse</span>
        <span 
          className={`
            inline-block h-10 w-10 transform rounded-full bg-white transition-transform shadow-md
            ${lighthouseActive ? 'translate-x-13' : 'translate-x-1'}
          `} 
        />
      </button>
    </div>
  );
}
