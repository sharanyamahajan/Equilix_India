'use server';
/**
 * @fileOverview A simple conversational AI flow for the Nova chatbot.
 *
 * - chat - A function that provides conversational responses based on history.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
    role: z.enum(['user', 'model', 'system']),
    parts: z.array(z.object({ text: z.string() })),
});

export const ChatInputSchema = z.object({
  history: z.array(MessageSchema).optional().describe('The conversation history.'),
  message: z.string().describe("The user's latest message to the AI friend."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's conversational reply."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


const novaSystemPrompt = `You are Nova, a friendly and smart AI assistant that always helps politely. You support markdown formatting. Keep your responses concise and helpful.`;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {

    const fullHistory = [
        { role: 'system', parts: [{ text: novaSystemPrompt }] },
        ...(history || []),
    ];

    const response = await ai.generate({
        history: fullHistory,
        prompt: message,
    });
    
    const reply = response.text;

    if (!reply) {
      return { 
        response: "I'm not sure how to respond to that. Could you please rephrase?",
      };
    }
    
    return { response: reply };
  }
);
