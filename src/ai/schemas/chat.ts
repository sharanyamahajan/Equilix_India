import { z } from 'genkit';

/**
 * @fileOverview Zod schemas and TypeScript types for the chatbot feature.
 *
 * - ChatInputSchema - Zod schema for the chatbot input.
 * - ChatInput - TypeScript type inferred from ChatInputSchema.
 * - ChatOutputSchema - Zod schema for the chatbot output.
 * - ChatOutput - TypeScript type inferred from ChatOutputSchema.
 */

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
