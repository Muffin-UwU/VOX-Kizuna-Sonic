'use client';

import React, { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { CommandType } from '@kizuna/types';

export default function VoiceGenerator() {
  const [text, setText] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<CommandType | 'preview'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBuffer, setGeneratedBuffer] = useState<ArrayBuffer | null>(null);
  const { setCustomSound, playCommand } = useAudio();

  const handleGenerate = async () => {
    if (!text) return;
    setIsGenerating(true);
    setGeneratedBuffer(null);

    const apiKey = process.env.NEXT_PUBLIC_MINIMAX_API_KEY || 'sk-cp-WD1kiNWZRjKFP41751GniXyCyqsuRo-m0uyvIZNyyIt6KpOzRSXpDKuxqcu50GXPmNDA5A20Nk-HgKdcbwvLTKZbd0womJM5WYTTT0KHToJf_LgBLGgYg5I';
    const groupId = process.env.NEXT_PUBLIC_MINIMAX_GROUP_ID || '2027975541096722533';
    const apiUrl = process.env.NEXT_PUBLIC_MINIMAX_API_URL || 'https://api.minimax.io/v1';

    if (!apiKey || !groupId) {
        console.error("Missing keys", { apiKey: !!apiKey, groupId: !!groupId });
        alert("Missing MiniMax API Key or Group ID. Please check your .env.local file.");
        setIsGenerating(false);
        return;
    }

    try {
      const payload = {
        model: "speech-01-turbo",
        text: text,
        stream: false,
        voice_setting: {
          voice_id: "male-qn-qingse",
          speed: 1.0,
          vol: 1.0,
          pitch: 0,
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3",
          channel: 1,
        }
      };

      const response = await fetch(`${apiUrl}/t2a_v2?GroupId=${groupId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
          const err = await response.text();
          throw new Error(`API Error: ${response.status} - ${err}`);
      }

      const data = await response.json();
      
      if (data.base_resp?.status_code !== 0) {
          throw new Error(data.base_resp?.status_msg || "Unknown API Error");
      }

      const hexString = data.data?.audio;
      if (!hexString) throw new Error("No audio data received");

      // Convert Hex string to ArrayBuffer
      // Create a Uint8Array from the hex string
      const match = hexString.match(/.{1,2}/g);
      if (!match) throw new Error("Invalid hex string");
      
      const buffer = new Uint8Array(match.map((byte: string) => parseInt(byte, 16))).buffer;
      setGeneratedBuffer(buffer);

    } catch (e: any) {
      console.error(e);
      alert(`Failed to generate voice: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (command: CommandType) => {
    if (!generatedBuffer) return;
    try {
        await setCustomSound(command, generatedBuffer.slice(0));
        alert(`Saved as ${command.toUpperCase()} command!`);
    } catch (e) {
        console.error("Error saving sound", e);
        alert("Failed to save sound");
    }
  };

  const handlePreview = async () => {
    if (!generatedBuffer) return;
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const audioBuffer = await ctx.decodeAudioData(generatedBuffer.slice(0));
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
    } catch (e) {
        console.error("Preview failed", e);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-12 p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🗣️</span>
        <h3 className="text-2xl font-bold text-white">Custom Voice Generator (MiniMax)</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text (e.g., 'Stop!', 'Good boy')"
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !text}
          className={`
            px-6 py-3 rounded-xl font-bold transition-all text-white shadow-lg
            ${isGenerating || !text 
              ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500'}
          `}
        >
          {isGenerating ? 'Generating...' : 'Generate Voice'}
        </button>
      </div>

      {generatedBuffer && (
        <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              ✓
            </div>
            <div>
              <p className="font-bold text-white">Audio Generated</p>
              <p className="text-xs text-neutral-400">{(generatedBuffer.byteLength / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-bold text-white transition-colors"
            >
              ▶ Preview
            </button>

            <div className="h-8 w-[1px] bg-neutral-600 mx-2 hidden md:block" />

            <span className="text-xs text-neutral-400 uppercase font-bold mr-2">Save to:</span>
            
            <button
              onClick={() => handleSave('stop')}
              className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-900 rounded-lg text-xs font-bold text-red-300 transition-colors"
            >
              STOP
            </button>
            <button
              onClick={() => handleSave('come')}
              className="px-3 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-900 rounded-lg text-xs font-bold text-green-300 transition-colors"
            >
              COME
            </button>
            <button
              onClick={() => handleSave('danger')}
              className="px-3 py-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-900 rounded-lg text-xs font-bold text-yellow-300 transition-colors"
            >
              DANGER
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
