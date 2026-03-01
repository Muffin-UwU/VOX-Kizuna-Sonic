// Types based on MiniMax API documentation
export interface MiniMaxTTSRequest {
  model: string; // e.g., "speech-01-turbo"
  text: string;
  voice_setting?: {
    voice_id: string; // e.g., "male-qn-qingse"
    speed?: number;
    vol?: number;
    pitch?: number;
  };
  audio_setting?: {
    sample_rate?: number;
    bitrate?: number;
    format?: 'mp3' | 'wav' | 'pcm' | 'flac';
  };
}

export interface MiniMaxTTSResponse {
  base_resp: {
    status_code: number;
    status_msg: string;
  };
  data: {
    audio: string; // Hex string of audio data
    status: number; // 2 means finished
    extra_info: any;
  };
}

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/t2a_v2';

export async function generateSpeech(text: string, voiceId: string = 'male-qn-qingse'): Promise<ArrayBuffer> {
  const apiKey = process.env.NEXT_MINIMAX_API_KEY;
  const groupId = process.env.NEXT_MINIMAX_GROUP_ID;

  if (!apiKey || !groupId) {
    throw new Error('Missing MiniMax API Key or Group ID');
  }

  const payload: MiniMaxTTSRequest = {
    model: 'speech-01-turbo',
    text: text,
    voice_setting: {
      voice_id: voiceId,
      speed: 1.0,
      vol: 1.0,
      pitch: 0,
    },
    audio_setting: {
      format: 'mp3',
      sample_rate: 32000,
    }
  };

  const response = await fetch(`${MINIMAX_API_URL}?GroupId=${groupId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as MiniMaxTTSResponse;

  if (data.base_resp?.status_code !== 0) {
    throw new Error(`MiniMax Service Error: ${data.base_resp?.status_msg}`);
  }

  // Convert Hex string to ArrayBuffer
  const hexString = data.data.audio;
  const buffer = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  return buffer.buffer;
}
