'use client';

import React from 'react';
import { useAgora } from '../hooks/useAgora';

export default function AgoraController() {
  const { joinChannel, leaveChannel, isConnected, error } = useAgora();

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={isConnected ? leaveChannel : joinChannel}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-bold tracking-wider
          ${isConnected 
            ? 'bg-red-900/50 border-red-800 text-red-400 hover:bg-red-900' 
            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}
        `}
      >
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        {isConnected ? 'DISCONNECT REMOTE' : 'CONNECT REMOTE'}
      </button>
      
      {error && (
        <span className="text-red-500 text-xs mt-2 max-w-[200px] text-center">
          {error}
        </span>
      )}
      
      {isConnected && (
        <span className="text-green-500 text-xs mt-2 font-mono">
          Streaming Audio...
        </span>
      )}
    </div>
  );
}
