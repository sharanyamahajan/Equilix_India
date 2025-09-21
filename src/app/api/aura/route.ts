'use server';

import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';


export async function POST(request: Request) {
    const { text, prompt } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
    }
    
    try {
        const result = await ai.generate({
            prompt: text,
            system: prompt,
        });

        const aiText = result.text;
        
        if (!aiText) {
             return NextResponse.json({ error: 'Failed to generate content from AI model.' }, { status: 500 });
        }
        
        return NextResponse.json({ text: aiText });

    } catch (error: any) {
        console.error("Error calling Gemini API via proxy:", error);
        return NextResponse.json({ error: error.message || 'An unknown error occurred with the AI model.' }, { status: 500 });
    }
}
