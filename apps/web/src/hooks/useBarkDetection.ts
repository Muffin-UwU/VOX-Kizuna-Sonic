import { useEffect, useRef, useState } from 'react';
import { calculateRMS } from '@kizuna/audio-utils';
import { audioEngine } from '../utils/audio';
import { useAppContext } from '../context/AppContext';

const BARK_THRESHOLD_DEFAULT = 0.3;
const BARK_DURATION_MS = 100; // Minimum duration to trigger
const BARK_COOLDOWN_MS = 1000; // Reset after 1s silence

export function useBarkDetection() {
  const { 
    setBarkDetected, 
    setMicPermission, 
    barkThreshold, 
    micPermission 
  } = useAppContext();

  const [isMonitoring, setIsMonitoring] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number>();
  const lastBarkTime = useRef<number>(0);
  const barkStartTime = useRef<number | null>(null);

  useEffect(() => {
    const startMonitoring = async () => {
      if (micPermission !== 'granted') return;
      
      try {
        if (!audioEngine.isInitialized) {
          audioEngine.init();
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const analyser = audioEngine.connectMicrophone(stream);
        analyserRef.current = analyser;
        setIsMonitoring(true);
        
        // Start analysis loop
        const analyze = () => {
          if (!analyserRef.current) return;
          
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteTimeDomainData(dataArray);
          
          const volume = calculateRMS(dataArray);
          const now = Date.now();
          const threshold = barkThreshold || BARK_THRESHOLD_DEFAULT;

          if (volume > threshold) {
            if (barkStartTime.current === null) {
              barkStartTime.current = now;
            } else if (now - barkStartTime.current > BARK_DURATION_MS) {
              // Valid bark detected
              if (now - lastBarkTime.current > BARK_COOLDOWN_MS) {
                setBarkDetected(true);
                lastBarkTime.current = now;
                
                // Reset alert after cooldown/duration
                setTimeout(() => setBarkDetected(false), BARK_COOLDOWN_MS);
              }
            }
          } else {
            barkStartTime.current = null;
          }

          requestRef.current = requestAnimationFrame(analyze);
        };
        
        analyze();

      } catch (err) {
        console.error("Error accessing microphone", err);
        setMicPermission('denied');
        setIsMonitoring(false);
      }
    };

    if (micPermission === 'granted' && !isMonitoring) {
      startMonitoring();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      // Note: We don't stop the media stream here to keep it active across re-renders,
      // but in a real app we might want to cleanup.
      // For now, we rely on the fact that AudioEngine persists.
    };
  }, [micPermission, barkThreshold, setBarkDetected, setMicPermission, isMonitoring]);

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
    } catch (e) {
      console.error("Mic permission denied", e);
      setMicPermission('denied');
    }
  };

  return { requestMicAccess, isMonitoring };
}
