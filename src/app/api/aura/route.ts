'use server';

import { NextResponse } from 'next/server';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

genkit({
    plugins: [googleAI()],
});

export async function POST(request: Request) {
    const { text, prompt } = await request.json();
    const model = googleAI.model('gemini-1.5-flash-latest');
    
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
    }
    
    try {
        const result = await genkit.generate({
            model: model,
            prompt: text,
            config: {
                // systemInstruction is not a standard config parameter in genkit.
                // We prepend it to the prompt.
            },
            history: [
                { role: 'system', parts: [{ text: prompt }]}
            ]
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
