'use server';
/**
 * @fileOverview A conversational AI friend with memory.
 *
 * - aiFriend - A function that provides conversational responses based on history.
 */

import { ai } from '@/ai/genkit';
import { AIFriendInputSchema, AIFriendOutputSchema, type AIFriendInput, type AIFriendOutput } from '@/ai/schemas/ai-friend';

export { type AIFriendInput, type AIFriendOutput };

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
  async ({ history, message, systemPrompt }) => {
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

    const model = ai.getModel('googleai/gemini-2.5-flash');

    const { candidates } = await model.generate({
      system: finalSystemPrompt,
      history: history?.map(msg => ({ role: msg.role, content: [{ text: msg.text }] })) || [],
      prompt: message,
    });

    const reply = candidates[0]?.message.content[0]?.text ?? "I'm not sure what to say. Could you try rephrasing?";

    return { reply };
  }
);
