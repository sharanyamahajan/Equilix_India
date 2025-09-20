'use server';
/**
 * @fileOverview An AI flow for generating a short story.
 *
 * - generateStory - A function that generates a story based on a prompt and genre.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateStoryInputSchema = z.object({
  prompt: z.string().describe("The user-provided prompt for the story."),
  genre: z.string().describe("The genre of the story (e.g., Fantasy, Sci-Fi, Mystery)."),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe("The generated story, approximately 3-5 paragraphs long."),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: { schema: GenerateStoryInputSchema },
  output: { schema: GenerateStoryOutputSchema },
  prompt: `You are a master storyteller. Write a short story (3-5 paragraphs) in the {{genre}} genre based on the following prompt.

The story should have a clear beginning, middle, and end. It should be engaging, creative, and well-written.

Prompt:
"{{{prompt}}}"

Generate the story now.
`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
