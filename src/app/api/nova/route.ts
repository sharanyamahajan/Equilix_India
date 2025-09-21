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

    const aiResponse = await aiFriend({
        history: [], // For simplicity, keeping history clean for each request.
        message: message,
        systemPrompt: novaSystemPrompt,
    } as AIFriendInput);
    
    if (aiResponse.reply) {
        return NextResponse.json({ reply: aiResponse.reply });
    } else {
         return NextResponse.json({ reply: "Hmm, I don’t have an answer right now." }, { status: 500 });
    }

  } catch (error) {
    console.error("Nova API Error:", error);
    return NextResponse.json({
      reply: "⚠️ Nova is having trouble connecting to AI. Try again later!",
    }, { status: 500 });
  }
}
