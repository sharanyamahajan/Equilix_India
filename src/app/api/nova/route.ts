// src/app/api/nova/route.ts
import { NextResponse } from 'next/server';
import { aiFriend } from '@/ai/flows/ai-friend';
import type { AIFriendInput } from '@/ai/schemas/ai-friend';

const novaSystemPrompt = `You are Nova, a friendly and smart AI assistant that always helps politely.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: "Invalid input" }, { status: 400 });
    }

    // The AI flow is now robust enough to handle errors, so we can simplify this.
    const aiResponse = await aiFriend({
        history: [], // For simplicity, keeping history clean for each request.
        message: message,
        systemPrompt: novaSystemPrompt,
    } as AIFriendInput);
    
    return NextResponse.json({ reply: aiResponse.reply });

  } catch (error) {
    console.error("Nova API Error:", error);
    // This is a fallback for unexpected server errors.
    return NextResponse.json({
      reply: "⚠️ Nova is having trouble with an internal error. Please try again later!",
    }, { status: 500 });
  }
}
