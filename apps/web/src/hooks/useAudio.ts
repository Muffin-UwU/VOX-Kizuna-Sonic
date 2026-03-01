import { useEffect, useRef, useState } from 'react';
import { CommandType } from '@kizuna/types';
import { audioEngine } from '../utils/audio';
import { useAppContext } from '../context/AppContext';

const SOUND_FILES: Record<string, string> = {
  stop: '/sounds/stop.mp3',
  come: '/sounds/come.mp3',
  danger: '/sounds/danger.mp3',
};

export function useAudio() {
  const { 
    setPlaying, 
    setCurrentCommand, 
    lighthouseActive,
    isPlaying,
    aiVoiceEnabled // New context value
  } = useAppContext();

  const currentSource = useRef<AudioBufferSourceNode | null>(null);
  const lighthouseOsc = useRef<OscillatorNode | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Audio Context on first user interaction
  const initAudio = async () => {
    if (!audioEngine.isInitialized) {
      audioEngine.init();
    }
    await audioEngine.resume();
    setIsReady(true);
  };

  // Preload sounds once initialized
  useEffect(() => {
    if (isReady) {
      const loadSounds = async () => {
        try {
          for (const [key, url] of Object.entries(SOUND_FILES)) {
            // Check global cache instead of local ref
            if (!audioEngine.getSound(key)) {
              try {
                // Pass key to cache it globally
                await audioEngine.loadSound(url, key);
              } catch (e) {
                console.warn(`Could not load sound ${key}, will use fallback beep.`);
              }
            }
          }
        } catch (e) {
          console.error("Failed to load sounds", e);
        }
      };
      loadSounds();
    }
  }, [isReady]);

  // Handle Lighthouse Toggle
  useEffect(() => {
    const manageLighthouse = async () => {
      if (lighthouseActive) {
        if (!isReady) await initAudio();
        
        if (!lighthouseOsc.current) {
          try {
            lighthouseOsc.current = audioEngine.createOscillator(15000, 'sine');
            lighthouseOsc.current.start();
          } catch (e) {
            console.error("Failed to start lighthouse", e);
          }
        }
      } else {
        if (lighthouseOsc.current) {
          try {
            lighthouseOsc.current.stop();
            lighthouseOsc.current.disconnect();
          } catch (e) {
            console.error("Error stopping lighthouse", e);
          }
          lighthouseOsc.current = null;
        }
      }
    };
    
    manageLighthouse();

    return () => {
      if (lighthouseOsc.current) {
        try {
          lighthouseOsc.current.stop();
          lighthouseOsc.current.disconnect();
        } catch {}
        lighthouseOsc.current = null;
      }
    };
  }, [lighthouseActive, isReady]);

  const playFallbackBeep = (command: CommandType) => {
    if (!audioEngine.isInitialized) return;
    
    // Different tones for different commands
    let freq = 440;
    let type: OscillatorType = 'sine';
    
    switch (command) {
      case 'stop': freq = 880; type = 'sawtooth'; break; // High pitch, sharp
      case 'come': freq = 440; type = 'sine'; break;     // Medium pitch, smooth
      case 'danger': freq = 220; type = 'square'; break; // Low pitch, rough
    }

    const osc = audioEngine.createOscillator(freq, type);
    const gain = audioEngine.context!.createGain();
    
    // Envelope
    osc.connect(gain);
    gain.connect(audioEngine.masterGain!);
    
    gain.gain.setValueAtTime(0.5, audioEngine.context!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioEngine.context!.currentTime + 1);
    
    osc.start();
    osc.stop(audioEngine.context!.currentTime + 1);
    
    // Simulate playing state
    setPlaying(true);
    setCurrentCommand(command);
    setTimeout(() => {
      setPlaying(false);
      setCurrentCommand(null);
    }, 1000);
  };

  const playCommand = async (command: CommandType) => {
    if (command === 'lighthouse') return; // Handled by toggle

    await initAudio();

    // Stop current command sound if playing
    if (currentSource.current) {
      try {
        currentSource.current.stop();
      } catch (e) {
        // Ignore error if already stopped
      }
      currentSource.current = null;
    }

    const buffer = audioEngine.getSound(command);
    
    // Logic: 
    // If aiVoiceEnabled is TRUE, try to play the buffer.
    // If buffer exists, play it.
    // If aiVoiceEnabled is FALSE, OR buffer is missing, play fallback beep.
    
    if (aiVoiceEnabled && buffer) {
      setCurrentCommand(command);
      setPlaying(true);
      
      try {
        const source = audioEngine.playBuffer(buffer);
        currentSource.current = source;
        
        source.onended = () => {
          setPlaying(false);
          setCurrentCommand(null);
          currentSource.current = null;
        };
      } catch (e) {
        console.error("Playback failed", e);
        setPlaying(false);
        setCurrentCommand(null);
      }
    } else {
      // Fallback to beep if AI voice disabled or file not found
      playFallbackBeep(command);
    }
  };

  const setCustomSound = async (command: string, buffer: ArrayBuffer) => {
    await initAudio();
    if (!audioEngine.context) return;
    
    try {
      const audioBuffer = await audioEngine.context.decodeAudioData(buffer);
      audioEngine.setSound(command, audioBuffer);
    } catch (e) {
      console.error("Failed to decode custom sound", e);
    }
  };

  return { playCommand, initAudio, isReady, setCustomSound };
}
