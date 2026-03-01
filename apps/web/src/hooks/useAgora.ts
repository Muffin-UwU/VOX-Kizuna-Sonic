import { useEffect, useState } from 'react';
import type { IAgoraRTCClient, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { audioEngine } from '../utils/audio';

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const CHANNEL_NAME = "kizuna-channel"; // Simplified for demo

export function useAgora() {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [AgoraRTC, setAgoraRTC] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !AgoraRTC) {
      import('agora-rtc-sdk-ng').then((mod) => {
        setAgoraRTC(mod.default);
        const agoraClient = mod.default.createClient({ mode: "rtc", codec: "vp8" });
        setClient(agoraClient);
      });
    }
  }, [AgoraRTC]);

  useEffect(() => {
      if (!client) return;

      const handleUserPublished = async (user: any, mediaType: "audio" | "video") => {
          await client.subscribe(user, mediaType);
          if (mediaType === "audio") {
              user.audioTrack?.play();
          }
      };

      const handleUserUnpublished = (user: any) => {
          if (user.audioTrack) user.audioTrack.stop();
      };

      client.on("user-published", handleUserPublished);
      client.on("user-unpublished", handleUserUnpublished);

      return () => {
          client.off("user-published", handleUserPublished);
          client.off("user-unpublished", handleUserUnpublished);
      };
  }, [client]);

  const joinChannel = async () => {
    if (!client) {
      setError("Agora Client not ready");
      return;
    }
    
    if (!AGORA_APP_ID) {
      setError("Missing NEXT_PUBLIC_AGORA_APP_ID");
      return;
    }

    try {
      // Ensure AudioEngine is running
      if (!audioEngine.isInitialized) {
        audioEngine.init();
      }
      await audioEngine.resume();

      // Join
      // Use token from env if available, otherwise null (for App ID only mode)
      const token = process.env.NEXT_PUBLIC_AGORA_TOKEN || null;
      await client.join(AGORA_APP_ID, CHANNEL_NAME, token, null);
      
      // Get the audio stream from the AudioEngine destination
      // This stream contains everything going to the speakers (commands, beeps)
      if (audioEngine.destinationStream) {
        const stream = audioEngine.destinationStream.stream;
        const audioTrack = stream.getAudioTracks()[0];
        
        if (audioTrack) {
           const customTrack = AgoraRTC.createCustomAudioTrack({
             mediaStreamTrack: audioTrack
           });
           
           await client.publish([customTrack]);
           setLocalAudioTrack(customTrack);
           setIsConnected(true);
           setError(null);
        } else {
            setError("No audio track found in destination stream");
        }
      } else {
        setError("AudioEngine destination stream not available");
      }

    } catch (e: any) {
      console.error("Agora Join Error:", e);
      setError(e.message || "Failed to join channel");
      setIsConnected(false);
    }
  };

  const leaveChannel = async () => {
    if (!client) return;
    
    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      await client.leave();
      setIsConnected(false);
      setLocalAudioTrack(null);
    } catch (e) {
      console.error("Agora Leave Error", e);
    }
  };

  return { joinChannel, leaveChannel, isConnected, error };
}
