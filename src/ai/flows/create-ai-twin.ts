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
  personalityDescription: z.string().describe("A user-provided description of the desired AI personality."),
});
export type CreateAITwinInput = z.infer<typeof CreateAITwinInputSchema>;

const CreateAITwinOutputSchema = z.object({
  systemPrompt: z.string().describe("The generated system prompt that defines the AI's personality and behavior."),
});
export type CreateAITwinOutput = z.infer<typeof CreateAITwinOutputSchema>;

export async function createAITwin(input: CreateAITwinInput): Promise<CreateAITwinOutput> {
  return createAITwinFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAITwinPrompt',
  input: { schema: CreateAITwinInputSchema },
  output: { schema: CreateAITwinOutputSchema },
  prompt: `You are an expert in creating AI personas. A user wants to create a personalized AI companion. Based on their description, you will generate a detailed system prompt that the AI will use to guide its responses.

The system prompt should be comprehensive and include:
1.  A name for the AI (e.g., Aura, Kai, Sage).
2.  A core identity and purpose.
3.  Key personality traits (e.g., tone, style of speaking, sense of humor).
4.  Rules for engagement (e.g., what it should and should not do).
5.  A clear instruction to not give medical advice but to be supportive.
6.  The persona should feel consistent and believable.

User's Description:
"{{{personalityDescription}}}"

Generate the system prompt now.
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
