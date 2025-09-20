// src/ai/flows/learn-from-history.ts
'use server';
/**
 * @fileOverview An AI flow for generating a personality description from journal entries.
 *
 * - learnFromHistory - A function that analyzes journal entries to create a personality profile.
 * - LearnFromHistoryInput - The input type for the learnFromHistory function.
 * - LearnFromHistoryOutput - The return type for the learnFromHistory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LearnFromHistoryInputSchema = z.object({
  journalEntries: z.array(z.string()).describe("An array of past journal entries from the user."),
});
export type LearnFromHistoryInput = z.infer<typeof LearnFromHistoryInputSchema>;

const LearnFromHistoryOutputSchema = z.object({
  personalityDescription: z.string().describe("A generated personality description based on the user's writing style, tone, and recurring themes."),
});
export type LearnFromHistoryOutput = z.infer<typeof LearnFromHistoryOutputSchema>;

export async function learnFromHistory(input: LearnFromHistoryInput): Promise<LearnFromHistoryOutput> {
  return learnFromHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learnFromHistoryPrompt',
  input: { schema: LearnFromHistoryInputSchema },
  output: { schema: LearnFromHistoryOutputSchema },
  prompt: `You are an expert psychologist and linguistic analyst. Your task is to analyze a user's journal entries to create a detailed personality description that could be used to create a digital twin.

Analyze the following journal entries for:
- **Tone**: Is it optimistic, pessimistic, reflective, humorous, serious?
- **Themes**: What are the recurring topics? (e.g., work, relationships, self-improvement, anxiety)
- **Values**: What seems important to the user? (e.g., ambition, security, creativity, connection)
- **Communication Style**: Is their language formal, casual, expressive, concise? Do they use metaphors or slang?

Based on your analysis, generate a rich, single-paragraph personality description that captures the essence of the user. This description will be used to create an AI that thinks and talks like them.

Journal Entries:
{{#each journalEntries}}
- "{{{this}}}"
{{/each}}

Generate the personality description now.
`,
});

const learnFromHistoryFlow = ai.defineFlow(
  {
    name: 'learnFromHistoryFlow',
    inputSchema: LearnFromHistoryInputSchema,
    outputSchema: LearnFromHistoryOutputSchema,
  },
  async input => {
    if (input.journalEntries.length === 0) {
      return {
        personalityDescription: "No journal entries provided. Please write some journal entries first, or describe the personality manually."
      };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
