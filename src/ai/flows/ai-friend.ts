
'use server';
/**
 * @fileOverview A conversational AI friend with memory, now repurposed for video calls.
 *
 * - aiFriend - A function that provides conversational responses based on history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';


const AIFriendInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })).optional().describe('The conversation history.'),
  message: z.string().describe("The user's latest message to the AI friend."),
});


const AIFriendOutputSchema = z.object({
  reply: z.string().describe("The AI friend's conversational reply."),
});


export async function aiFriend(input: z.infer<typeof AIFriendInputSchema>): Promise<z.infer<typeof AIFriendOutputSchema>> {
  return aiFriendFlow(input);
}

const auraSystemPrompt = `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm, suitable for being spoken aloud.`;

const aiFriendFlow = ai.defineFlow(
  {
    name: 'aiFriendFlow',
    inputSchema: AIFriendInputSchema,
    outputSchema: AIFriendOutputSchema,
  },
  async ({ history, message }) => {
    const fullHistory = [
      ...(history?.map(msg => ({ role: msg.role, content: [{ text: msg.text }] })) || []),
    ];

    const response = await ai.generate({
      system: auraSystemPrompt,
      history: fullHistory,
      prompt: message,
    });
    
    const reply = response.text;

    if (!reply) {
      return { 
        reply: "I'm not sure how to respond to that. Can you try rephrasing?",
      };
    }
    
    return { reply };
  }
);
