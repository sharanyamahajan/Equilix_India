'use server';
/**
 * @fileOverview A wellness analysis AI agent.
 *
 * - analyzeWellness - A function that handles the wellness analysis process.
 * - WellnessSurveyInput - The input type for the analyzeWellness function.
 * - WellnessAnalysisOutput - The return type for the analyzeWellness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const WellnessSurveyInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  mood: z.number().describe('The user\'s mood on a scale of 0 to 100.'),
  thoughts: z.string().describe('A summary of what is on the user\'s mind.'),
});
export type WellnessSurveyInput = z.infer<typeof WellnessSurveyInputSchema>;

export const WellnessAnalysisOutputSchema = z.object({
  mood: z.string().describe("A single word describing the user's mood (e.g., Positive, Neutral, Negative)."),
  summary: z.string().describe('A brief, empathetic summary of the user\'s feelings.'),
  suggestions: z.array(z.string()).describe('A list of 3-5 actionable suggestions tailored to the user\'s age and mood.'),
  recommendedAction: z.string().describe('A single, primary recommended action for the user to take.'),
});
export type WellnessAnalysisOutput = z.infer<typeof WellnessAnalysisOutputSchema>;

export async function analyzeWellness(input: WellnessSurveyInput): Promise<WellnessAnalysisOutput> {
  return analyzeWellnessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWellnessPrompt',
  input: {schema: WellnessSurveyInputSchema},
  output: {schema: WellnessAnalysisOutputSchema},
  prompt: `You are a compassionate and insightful wellness coach. Analyze the following user input to provide a supportive and helpful analysis. The user is {{age}} years old. Their mood is rated {{mood}} out of 100.

Here's what's on their mind:
"{{{thoughts}}}"

Based on their age, mood, and thoughts, please provide the following:
1.  A single-word assessment of their overall mood (Positive, Neutral, or Negative).
2.  A brief, empathetic summary of their current state.
3.  A list of 3-5 actionable, age-appropriate suggestions to improve their well-being.
4.  A single, primary recommended action they can take right now.

Your tone should be gentle, encouraging, and non-judgmental. Do not provide medical advice.
`,
});

const analyzeWellnessFlow = ai.defineFlow(
  {
    name: 'analyzeWellnessFlow',
    inputSchema: WellnessSurveyInputSchema,
    outputSchema: WellnessAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
