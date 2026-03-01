'use client';

import React from 'react';
import { useBarkDetection } from '../hooks/useBarkDetection';
import { useAppContext } from '../context/AppContext';

export default function PermissionRequest() {
  const { requestMicAccess } = useBarkDetection();
  const { micPermission } = useAppContext();

  if (micPermission === 'granted') return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-neutral-900 p-8 rounded-3xl max-w-lg text-center border border-neutral-800 shadow-2xl">
        <div className="text-6xl mb-6">🎙️</div>
        <h2 className="text-3xl font-bold mb-4 text-white">Enable Bark Detection</h2>
        <p className="text-neutral-400 mb-8 text-lg">
          Kizuna Sonic listens for your dog&apos;s barks to provide visual alerts. 
          Please allow microphone access to continue.
        </p>
        
        <button 
          onClick={requestMicAccess}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl py-4 px-8 rounded-xl transition-all w-full shadow-lg transform active:scale-95"
        >
          Allow Microphone Access
        </button>
        
        {micPermission === 'denied' && (
          <div className="mt-6 p-4 bg-red-900/30 rounded-xl border border-red-900/50">
            <p className="text-red-400 font-medium">
              Access was denied. Please enable microphone permissions in your browser settings and refresh the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
