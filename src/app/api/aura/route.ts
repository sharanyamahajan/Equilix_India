
import {NextRequest, NextResponse} from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      {error: 'API key is not configured on the server.'},
      {status: 500}
    );
  }

  try {
    const { action, sessionName, sdp, model } = await req.json();

    if (action === 'create_session') {
      const sessionResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}/sessions?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // The modalities should be nested inside a 'session' object.
          body: JSON.stringify({ session: { modalities: ['TEXT', 'AUDIO'] } }),
        }
      );

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error('Gemini Session API Error:', errorText);
        return NextResponse.json(
          { error: `Gemini Session API failed: ${errorText}` },
          { status: sessionResponse.status }
        );
      }
      
      const sessionData = await sessionResponse.json();
      return NextResponse.json(sessionData);

    } else if (action === 'exchange_sdp') {
      if (!sessionName || !sdp || !model) {
        return NextResponse.json(
          { error: 'Session name, SDP, and model are required for exchange.' },
          { status: 400 }
        );
      }

      const sdpResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}/sessions/${sessionName}:exchange?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sdp: sdp }),
        }
      );
      
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('Gemini SDP Exchange API Error:', errorText);
        return NextResponse.json(
          { error: `Gemini SDP Exchange API failed: ${errorText}` },
          { status: sdpResponse.status }
        );
      }
      
      const answerData = await sdpResponse.json();
      return NextResponse.json(answerData);

    } else {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Proxy API Error:', error);
    return NextResponse.json(
      {error: error.message || 'An internal server error occurred.'},
      {status: 500}
    );
  }
}
