'use server';
/**
 * @fileOverview An AI flow for detecting a specific mantra chant from lip shape in an image.
 * 
 * - detectOmChant - A function that handles the Om chant detection process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectOmChantInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    mantra: z.string().describe("The specific mantra the user is supposed to be chanting (e.g., 'Om', 'So-ham')."),
});
export type DetectOmChantInput = z.infer<typeof DetectOmChantInputSchema>;

const DetectOmChantOutputSchema = z.object({
  isChanting: z.boolean().describe("True if the user's lips are forming the shape for the specified mantra, false otherwise."),
});
export type DetectOmChantOutput = z.infer<typeof DetectOmChantOutputSchema>;

export async function detectOmChant(input: DetectOmChantInput): Promise<DetectOmChantOutput> {
  return detectOmChantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectOmChantPrompt',
  input: { schema: DetectOmChantInputSchema },
  output: { schema: DetectOmChantOutputSchema },
  prompt: `You are an expert in analyzing facial expressions and lip reading. Look at the image provided and determine if the person's mouth is in the specific shape of chanting the mantra: "{{{mantra}}}".

For the mantra "Om", the mouth should be rounded and open, forming an 'O' shape. For "So-ham", you would look for the lip movements corresponding to those syllables.

- If the lips are clearly forming the primary shape for the mantra "{{{mantra}}}", set isChanting to true.
- If the lips are in any other position (closed, smiling, talking, etc.), set isChanting to false.
- If no face is visible, set isChanting to false.

Analyze the image and respond.

Image to analyze: {{media url=imageDataUri}}`,
});

const detectOmChantFlow = ai.defineFlow(
  {
    name: 'detectOmChantFlow',
    inputSchema: DetectOmChantInputSchema,
    outputSchema: DetectOmChantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
