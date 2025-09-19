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
  prompt: `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm.

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
