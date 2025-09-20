'use server';
/**
 * @fileOverview A conversational AI friend.
 * 
 * - aiFriend - A function that provides conversational responses.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AIFriendInputSchema = z.object({
  message: z.string().describe("The user's message to the AI friend."),
  systemPrompt: z.string().optional().describe("An optional system prompt to define the AI's personality. If not provided, a default persona will be used."),
});
export type AIFriendInput = z.infer<typeof AIFriendInputSchema>;

const AIFriendOutputSchema = z.object({
  reply: z.string().describe("The AI friend's conversational reply."),
});
export type AIFriendOutput = z.infer<typeof AIFriendOutputSchema>;

export async function aiFriend(input: AIFriendInput): Promise<AIFriendOutput> {
  return aiFriendFlow(input);
}

const defaultSystemPrompt = `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm.`;

const aiFriendFlow = ai.defineFlow(
  {
    name: 'aiFriendFlow',
    inputSchema: AIFriendInputSchema,
    outputSchema: AIFriendOutputSchema,
  },
  async ({ message, systemPrompt }) => {
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

    const prompt = ai.definePrompt({
      name: 'aiFriendPrompt',
      prompt: `${finalSystemPrompt}

User's message: "{{{message}}}"`,
      input: {
        schema: z.object({ message: z.string() })
      },
      output: {
        schema: AIFriendOutputSchema
      }
    });

    const { output } = await prompt({ message });
    return output!;
  }
);
