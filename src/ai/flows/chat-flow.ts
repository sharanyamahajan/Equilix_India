'use server';
/**
 * @fileOverview A simple conversational AI flow for the Nova chatbot.
 *
 * - chat - A function that provides conversational responses based on history.
 */

import { ai } from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/ai/schemas/chat';

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
