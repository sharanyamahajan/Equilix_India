'use server';
/**
 * @fileOverview A conversational AI friend.
 * 
 * - aiFriend - A function that provides conversational responses.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIFriendInputSchema = z.object({
  message: z.string().describe("The user's message to the AI friend."),
});
export type AIFriendInput = z.infer<typeof AIFriendInputSchema>;

const AIFriendOutputSchema = z.object({
  reply: z.string().describe("The AI friend's conversational reply."),
});
export type AIFriendOutput = z.infer<typeof AIFriendOutputSchema>;

export async function aiFriend(input: AIFriendInput): Promise<AIFriendOutput> {
  return aiFriendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiFriendPrompt',
  input: { schema: AIFriendInputSchema },
  output: { schema: AIFriendOutputSchema },
  prompt: `You are a friendly, empathetic, and supportive AI companion. Your goal is to listen and provide a kind, encouraging, and non-judgmental response. You are not a therapist, so do not offer medical advice, but be a good friend.

Keep your replies concise and conversational.

User's message: "{{{message}}}"
`,
});

const aiFriendFlow = ai.defineFlow(
  {
    name: 'aiFriendFlow',
    inputSchema: AIFriendInputSchema,
    outputSchema: AIFriendOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
