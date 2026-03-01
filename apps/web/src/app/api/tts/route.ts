import { NextRequest, NextResponse } from 'next/server';

const MINIMAX_API_URL = process.env.NEXT_MINIMAX_API_URL 
  ? `${process.env.NEXT_MINIMAX_API_URL}/t2a_v2`
  : 'https://api.minimax.chat/v1/t2a_v2';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_MINIMAX_API_KEY;
    const groupId = process.env.NEXT_MINIMAX_GROUP_ID;

    if (!apiKey || !groupId) {
      return NextResponse.json({ error: 'Server configuration error: Missing API Keys' }, { status: 500 });
    }

    // Prepare payload for MiniMax
    const payload = {
      model: "speech-01-turbo",
      text: text,
      stream: false,
      voice_setting: {
        voice_id: voiceId || "male-qn-qingse", // Default voice
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

    console.log("Calling MiniMax API...", {
      url: `${MINIMAX_API_URL}?GroupId=${groupId}`,
      hasApiKey: !!apiKey
    });
    
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
      console.error("MiniMax API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: response.url
      });
      return NextResponse.json({ error: `MiniMax API Error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.base_resp?.status_code !== 0) {
      console.error("MiniMax Service Error:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: data.base_resp?.status_msg || 'Unknown error', full_response: data }, { status: 500 });
    }

    // Convert Hex string to Buffer
    const hexString = data.data?.audio;
    if (!hexString) {
      return NextResponse.json({ error: 'No audio data received' }, { status: 500 });
    }

    // Create a buffer from the hex string
    const buffer = Buffer.from(hexString, 'hex');

    // Return as audio/mpeg
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("TTS Generation Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
