'use server';
/**
 * @fileOverview An AI flow for detecting stress from facial expressions and text.
 * 
 * - detectStress - A function that handles the stress detection process.
 * - DetectStressInput - The input type for the detectStress function.
 * - DetectStressOutput - The return type for the detectStress function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectStressInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  text: z.string().describe("A piece of text where the user describes their feelings."),
});
export type DetectStressInput = z.infer<typeof DetectStressInputSchema>;

const DetectStressOutputSchema = z.object({
  stressScore: z.number().min(0).max(100).describe("The combined stress score from 0 to 100."),
  feedback: z.string().describe("A short, encouraging, and empathetic feedback message for the user based on their combined stress level."),
});
export type DetectStressOutput = z.infer<typeof DetectStressOutputSchema>;

export async function detectStress(input: DetectStressInput): Promise<DetectStressOutput> {
  return detectStressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectStressPrompt',
  input: { schema: DetectStressInputSchema },
  output: { schema: DetectStressOutputSchema },
  prompt: `You are an expert at analyzing human stress levels by combining facial expression analysis with text analysis. Look at the image provided and analyze the accompanying text to determine a holistic stress score.

Your analysis should be empathetic and supportive.

1.  **Analyze the Image**: Look for signs of stress in the face (e.g., furrowed brow, tense jaw, tired eyes).
2.  **Analyze the Text**: Look for keywords and sentiment related to stress, anxiety, being overwhelmed, or frustrated.
3.  **Combine Insights**: Synthesize the visual and textual information to generate a single stress score from 0 (completely relaxed) to 100 (extremely stressed).
4.  **Provide Feedback**: Based on the combined score, provide a brief, positive, and encouraging piece of feedback. For low stress, be affirming. For high stress, be gentle and suggest taking a break or using a relaxation technique.

If no face is detected, rely primarily on the text.

Image to analyze: {{media url=imageDataUri}}
User's thoughts: "{{{text}}}"`,
});

const detectStressFlow = ai.defineFlow(
  {
    name: 'detectStressFlow',
    inputSchema: DetectStressInputSchema,
    outputSchema: DetectStressOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
