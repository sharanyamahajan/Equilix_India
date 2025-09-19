import {z} from 'genkit';

/**
 * @fileOverview Zod schemas and TypeScript types for the wellness analysis feature.
 *
 * - WellnessSurveyInputSchema - Zod schema for the wellness survey input.
 * - WellnessSurveyInput - TypeScript type inferred from WellnessSurveyInputSchema.
 * - WellnessAnalysisOutputSchema - Zod schema for the wellness analysis output.
 * - WellnessAnalysisOutput - TypeScript type inferred from WellnessAnalysisOutputSchema.
 */

export const WellnessSurveyInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  mood: z.number().describe("The user's mood on a scale of 0 to 100."),
  thoughts: z.string().describe("A summary of what is on the user's mind."),
});
export type WellnessSurveyInput = z.infer<typeof WellnessSurveyInputSchema>;

export const WellnessAnalysisOutputSchema = z.object({
  mood: z
    .string()
    .describe(
      "A single word describing the user's mood (e.g., Positive, Neutral, Negative)."
    ),
  summary: z
    .string()
    .describe('A brief, empathetic summary of the user\'s feelings.'),
  suggestions: z
    .array(z.string())
    .describe(
      'A list of 3-5 actionable suggestions tailored to the user\'s age and mood.'
    ),
  recommendedAction: z
    .string()
    .describe('A single, primary recommended action for the user to take.'),
});
export type WellnessAnalysisOutput = z.infer<
  typeof WellnessAnalysisOutputSchema
>;
