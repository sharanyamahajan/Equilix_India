import { z } from 'zod';

/**
 * @fileOverview Zod schemas and TypeScript types for the AI Friend feature.
 *
 * - AIFriendInputSchema - Zod schema for the AI friend input.
 * - AIFriendInput - TypeScript type inferred from AIFriendInputSchema.
 * - AIFriendOutputSchema - Zod schema for the AI friend output.
 * - AIFriendOutput - TypeScript type inferred from AIFriendOutputSchema.
 */

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

export const AIFriendInputSchema = z.object({
  history: z.array(MessageSchema).optional().describe('The conversation history.'),
  message: z.string().describe("The user's latest message to the AI friend."),
  systemPrompt: z.string().optional().describe("An optional system prompt to define the AI's personality. If not provided, a default persona will be used."),
});
export type AIFriendInput = z.infer<typeof AIFriendInputSchema>;

export const AIFriendOutputSchema = z.object({
  reply: z.string().describe("The AI friend's conversational reply."),
  toolCalls: z.array(z.object({
    toolName: z.string(),
    args: z.record(z.any()),
  })).optional().describe('A list of tool calls made by the AI.'),
});
export type AIFriendOutput = z.infer<typeof AIFriendOutputSchema>;
