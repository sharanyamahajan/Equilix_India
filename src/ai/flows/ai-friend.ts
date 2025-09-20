'use server';
/**
 * @fileOverview A conversational AI friend with memory.
 *
 * - aiFriend - A function that provides conversational responses based on history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { AIFriendInputSchema, AIFriendOutputSchema, type AIFriendInput, type AIFriendOutput } from '@/ai/schemas/ai-friend';

export { type AIFriendInput, type AIFriendOutput };

const navigationTool = ai.defineTool(
  {
    name: 'navigation',
    description: 'Navigate to a specific page in the application. Available pages are: Home, Dashboard, AI Friend, Marketplace, Community, About, Journal, Breathing Exercise, Emotion Scan, Mantra Chanting, My AI Twin.',
    inputSchema: z.object({
      path: z.string().describe('The path to navigate to, e.g., /journal'),
    }),
    outputSchema: z.string(),
  },
  async ({ path }) => `Navigating to ${path}`
);


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

    const response = await ai.generate({
      system: finalSystemPrompt,
      history: history?.map(msg => ({ role: msg.role, content: [{ text: msg.text }] })) || [],
      prompt: message,
      tools: [navigationTool],
    });

    const choice = response.candidates[0];
    
    const toolCalls = choice.message.content.filter(part => part.type === 'toolRequest').map(part => {
        if(part.type !== 'toolRequest') throw new Error(); // Should not happen
        return { toolName: part.toolRequest.name, args: part.toolRequest.input };
    });

    const textReply = choice.message.content.filter(part => part.type === 'text').map(part => part.type === 'text' ? part.text : '').join('').trim();
    
    let reply = textReply;

    if (toolCalls.length > 0 && !textReply) {
        reply = "Certainly, one moment...";
    } else if (!textReply) {
        reply = "I'm not sure what to say. Could you try rephrasing?";
    }
    
    return { 
        reply,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }
);
