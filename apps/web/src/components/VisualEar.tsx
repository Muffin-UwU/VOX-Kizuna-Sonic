'use client';

import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audio';
import { useAppContext } from '../context/AppContext';

export default function VisualEar() {
  const { barkDetected, isPlaying } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const analyser = audioEngine.analyser;
      // If analyser not ready, just clear canvas
      if (!analyser) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         requestRef.current = requestAnimationFrame(draw);
         return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      // Clear with semi-transparent black for trail effect? No, clean wipe for crisp waveform
      ctx.fillStyle = '#0a0a0a'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 3;
      // Dynamic color based on state
      if (barkDetected) {
        ctx.strokeStyle = '#ef4444'; // Red
      } else if (isPlaying) {
        ctx.strokeStyle = '#22c55e'; // Green
      } else {
        ctx.strokeStyle = '#3b82f6'; // Blue
      }
      
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, barkDetected]);

  return (
    <div className="relative w-full max-w-4xl h-64 bg-black rounded-3xl overflow-hidden border-2 border-neutral-800 shadow-2xl mt-8">
      <canvas 
        ref={canvasRef} 
        width={1024} 
        height={300} 
        className="w-full h-full"
      />
      
      {/* Bark Alert Overlay */}
      {barkDetected && (
        <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center z-20 animate-pulse">
          <span className="text-8xl mb-4">🐕</span>
          <h2 className="text-5xl font-black text-white tracking-widest uppercase">Bark Detected!</h2>
        </div>
      )}
      
      {/* Status Indicator */}
      <div className="absolute top-4 left-6 flex items-center gap-3 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-ping' : 'bg-blue-500'}`} />
        <span className="text-xs text-neutral-300 font-mono tracking-wider uppercase">
          {isPlaying ? 'Playing Audio' : 'Listening Mode'}
        </span>
      </div>
    </div>
  );
}
