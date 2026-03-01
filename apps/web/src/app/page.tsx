'use client';

import CommandPalette from '../components/CommandPalette';
import VisualEar from '../components/VisualEar';
import SonicLighthouse from '../components/SonicLighthouse';
import PermissionRequest from '../components/PermissionRequest';
import GestureCanvas from '../components/GestureCanvas';
import AgoraController from '../components/AgoraController';
import { useAppContext } from '../context/AppContext';

function GestureToggle() {
  const { gestureEnabled, setGestureEnabled } = useAppContext();
  
  return (
    <button 
      onClick={() => setGestureEnabled(!gestureEnabled)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full border transition-all
        ${gestureEnabled 
          ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}
      `}
    >
      <span className="text-xl">✋</span>
      <span className="text-xs font-bold uppercase tracking-wider">
        {gestureEnabled ? 'Gestures On' : 'Enable Gestures'}
      </span>
    </button>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 relative overflow-hidden bg-gradient-to-b from-black via-neutral-900 to-black">
      <PermissionRequest />
      
      {/* Header */}
      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-16 border-b border-neutral-800 pb-8">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-2">
            Kizuna Sonic
          </h1>
          <p className="text-neutral-400 text-lg tracking-widest uppercase">
            Sensory Bridge for Deaf Owners & Blind Dogs
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6 md:mt-0">
          <AgoraController />
          <GestureToggle />
          <div className="bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-sm font-mono text-green-400">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex flex-col items-center w-full max-w-5xl gap-10 z-10">
        <CommandPalette />
        <VisualEar />
        <GestureCanvas />
        <SonicLighthouse />
      </div>
      
      {/* Footer */}
      <div className="mt-20 text-neutral-600 text-xs font-mono uppercase tracking-widest text-center">
        VOX TOKYO Voice AI Hackathon for Social Impact • 2026
      </div>
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
    </main>
  );
}
