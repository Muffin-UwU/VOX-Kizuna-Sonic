'use client';

import React from 'react';
import { useGestureRecognition } from '../hooks/useGestureRecognition';
import { useAppContext } from '../context/AppContext';
import { useAudio } from '../hooks/useAudio';
import { CommandType } from '@kizuna/types';

export default function GestureCanvas() {
  const { gestureEnabled, setCameraPermission, cameraPermission, isPlaying } = useAppContext();
  const { playCommand } = useAudio();

  const handleGestureDetected = (command: CommandType) => {
    if (!isPlaying) {
      console.log("Gesture Triggered:", command);
      playCommand(command);
    }
  };

  const { videoRef, canvasRef, requestCameraAccess, detectedGestureName, isReady } = useGestureRecognition(handleGestureDetected);

  if (!gestureEnabled) return null;

  return (
    <div className="relative w-full max-w-lg mt-8 rounded-3xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-black">
       {/* Permission Prompt */}
       {cameraPermission !== 'granted' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Enable Camera</h3>
          <p className="text-neutral-400 mb-4 text-sm">
            Allow camera access to use hand gestures for commands.
          </p>
          <button 
            onClick={requestCameraAccess}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl"
          >
            Allow Camera
          </button>
        </div>
      )}

      {/* Loading State */}
      {cameraPermission === 'granted' && !isReady && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <span className="text-neutral-400 animate-pulse">Loading Model...</span>
        </div>
      )}

      {/* Video & Canvas */}
      <div className="relative aspect-video bg-neutral-900">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" // Mirror effect
          autoPlay 
          playsInline 
          muted
        />
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" // Mirror effect
        />
        
        {/* Overlay Info */}
        <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-white">LIVE FEED</span>
          </div>
        </div>

        {/* Detected Gesture Feedback */}
        {detectedGestureName && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600/90 px-6 py-2 rounded-full backdrop-blur-md z-10 animate-bounce">
            <span className="text-white font-bold tracking-wider">{detectedGestureName}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-neutral-900 border-t border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Gesture Map</h4>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-300">
          <div className="bg-neutral-800 p-2 rounded">
            <span className="block text-lg">✋</span>
            Open Palm<br/><span className="text-red-400 font-bold">STOP</span>
          </div>
          <div className="bg-neutral-800 p-2 rounded">
            <span className="block text-lg">☝️</span>
            Point Up<br/><span className="text-green-400 font-bold">COME</span>
          </div>
          <div className="bg-neutral-800 p-2 rounded">
            <span className="block text-lg">✊</span>
            Fist<br/><span className="text-yellow-400 font-bold">DANGER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
