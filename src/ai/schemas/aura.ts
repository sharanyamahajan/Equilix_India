import { z } from 'genkit';

/**
 * @fileOverview Zod schemas and TypeScript types for the Aura AI friend feature.
 *
 * - AIFriendInputSchema - Zod schema for the AI friend input.
 * - AIFriendInput - TypeScript type inferred from AIFriendInputSchema.
 * - AIFriendOutputSchema - Zod schema for the AI friend output.
 * - AIFriendOutput - TypeScript type inferred from AIFriendOutputSchema.
 */

export const AIFriendInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })).optional().describe('The conversation history.'),
  message: z.string().describe("The user's latest message to the AI friend."),
});
export type AIFriendInput = z.infer<typeof AIFriendInputSchema>;


export const AIFriendOutputSchema = z.object({
  reply: z.string().describe("The AI friend's conversational reply."),
  audio: z.string().describe("The base64 encoded WAV audio data URI of the reply."),
});
export type AIFriendOutput = z.infer<typeof AIFriendOutputSchema>;
