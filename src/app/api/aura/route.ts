import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const sdp = await req.text();

    if (!sdp) {
      return NextResponse.json(
        {error: 'Session Description (SDP) is required.'},
        {status: 400}
      );
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {error: 'API key is not configured on the server.'},
        {status: 500}
      );
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-preview-0514:streamGenerateContent?alt=sdp&key=${process.env.GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/sdp'},
      body: sdp,
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json(
        {error: `Gemini API failed: ${errorText}`},
        {status: geminiResponse.status}
      );
    }

    const answerSdp = await geminiResponse.text();

    return new Response(answerSdp, {
        headers: { 'Content-Type': 'application/sdp' },
    });
  } catch (error: any) {
    console.error('Proxy API Error:', error);
    return NextResponse.json(
      {error: error.message || 'An internal server error occurred.'},
      {status: 500}
    );
  }
}
