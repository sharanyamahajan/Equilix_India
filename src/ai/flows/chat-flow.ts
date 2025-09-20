'use server';
/**
 * @fileOverview A conversational AI flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
  message: z.string(),
});

const ChatOutputSchema = z.object({
  response: z.string(),
});

export async function chat(input: z.infer<typeof ChatInputSchema>): Promise<z.infer<typeof ChatOutputSchema>> {
  const { history, message } = input;

  const prompt = `You are a helpful AI assistant named Swasthya Raksha Assistant. Your purpose is to provide information about water-borne diseases, public health, and how to use this application.

Here is the conversation history:
${history?.map(msg => `${msg.role}: ${msg.content}`).join('\n') || 'No history yet.'}

User: ${message}
Model:`;

  const llmResponse = await ai.generate({
    prompt: prompt,
    model: 'googleai/gemini-2.5-flash',
  });

  return { response: llmResponse.text };
}
