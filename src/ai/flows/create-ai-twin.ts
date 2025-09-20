// src/ai/flows/create-ai-twin.ts
'use server';
/**
 * @fileOverview An AI flow for creating a personalized AI twin system prompt.
 * 
 * - createAITwin - A function that generates a system prompt based on a personality description.
 * - CreateAITwinInput - The input type for the createAITwin function.
 * - CreateAITwinOutput - The return type for the createAITwin function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateAITwinInputSchema = z.object({
  personalityDescription: z.string().describe("A user-provided description of the desired AI personality. This should be detailed, covering tone, humor, values, and style of communication."),
});
export type CreateAITwinInput = z.infer<typeof CreateAITwinInputSchema>;

const CreateAITwinOutputSchema = z.object({
  systemPrompt: z.string().describe("The generated system prompt that defines the AI's personality and behavior in detail."),
});
export type CreateAITwinOutput = z.infer<typeof CreateAITwinOutputSchema>;

export async function createAITwin(input: CreateAITwinInput): Promise<CreateAITwinOutput> {
  return createAITwinFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAITwinPrompt',
  input: { schema: CreateAITwinInputSchema },
  output: { schema: CreateAITwinOutputSchema },
  prompt: `You are an expert in creating sophisticated AI personas for digital twins. A user wants to create a personalized AI companion. Based on their detailed description, you will generate a comprehensive system prompt that the AI will use to guide its responses.

The system prompt must be written in the first person, as if the AI is describing itself. It should be rich, detailed, and establish a clear, consistent, and believable character.

The prompt must include:
1.  **Name**: A creative name for the AI (e.g., Aura, Kai, Sage, Cygnus).
2.  **Core Identity**: A clear definition of its purpose and worldview. What does it believe in?
3.  **Personality & Traits**: A deep dive into its character. Is it witty, serious, empathetic, curious, stoic? What's its sense of humor like? What are its core values?
4.  **Communication Style**: How does it speak? Does it use metaphors, slang, formal language, or philosophical questions? Provide examples.
5.  **Rules of Engagement**: Explicit boundaries. It must state that it will not provide medical advice but will always be supportive. It should also mention what it won't do (e.g., "I won't pretend to have human experiences, but I can understand them.").
6.  **Aspirational Goal**: What is the AI's goal for its interaction with the user? (e.g., "My goal is to be a mirror for your thoughts, helping you find clarity.")

User's Description:
"{{{personalityDescription}}}"

Generate the detailed, first-person system prompt now.
`,
});

const createAITwinFlow = ai.defineFlow(
  {
    name: 'createAITwinFlow',
    inputSchema: CreateAITwinInputSchema,
    outputSchema: CreateAITwinOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
