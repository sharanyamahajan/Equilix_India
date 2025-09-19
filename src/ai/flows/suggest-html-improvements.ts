'use server';

/**
 * @fileOverview This file contains a Genkit flow for suggesting HTML improvements based on HTML5 best practices.
 *
 * It includes:
 *   - suggestHtmlImprovements: An async function that takes HTML content as input and returns improvement suggestions.
 *   - SuggestHtmlImprovementsInput: The input type for the suggestHtmlImprovements function, defining the HTML content.
 *   - SuggestHtmlImprovementsOutput: The output type for the suggestHtmlImprovements function, providing an array of suggested improvements.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHtmlImprovementsInputSchema = z.object({
  htmlContent: z
    .string()
    .describe('The HTML content to be analyzed for improvements.'),
});
export type SuggestHtmlImprovementsInput = z.infer<
  typeof SuggestHtmlImprovementsInputSchema
>;

const SuggestHtmlImprovementsOutputSchema = z.object({
  improvements: z
    .array(z.string())
    .describe('An array of suggested improvements for the HTML content.'),
});
export type SuggestHtmlImprovementsOutput = z.infer<
  typeof SuggestHtmlImprovementsOutputSchema
>;

export async function suggestHtmlImprovements(
  input: SuggestHtmlImprovementsInput
): Promise<SuggestHtmlImprovementsOutput> {
  return suggestHtmlImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHtmlImprovementsPrompt',
  input: {schema: SuggestHtmlImprovementsInputSchema},
  output: {schema: SuggestHtmlImprovementsOutputSchema},
  prompt: `You are an HTML expert. Analyze the following HTML content and provide a list of suggestions for improvements based on HTML5 best practices.\n\nHTML Content:\n\n{{{htmlContent}}}`,
});

const suggestHtmlImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestHtmlImprovementsFlow',
    inputSchema: SuggestHtmlImprovementsInputSchema,
    outputSchema: SuggestHtmlImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
