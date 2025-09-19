'use server';
/**
 * @fileOverview An AI flow for detecting emotions from facial expressions in an image.
 * 
 * - detectEmotion - A function that handles the emotion detection process.
 * - DetectEmotionInput - The input type for the detectEmotion function.
 * - DetectEmotionOutput - The return type for the detectEmotion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectEmotionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectEmotionInput = z.infer<typeof DetectEmotionInputSchema>;

const DetectEmotionOutputSchema = z.object({
  emotion: z.string().describe("The detected primary emotion (e.g., Happy, Sad, Angry, Surprised, Neutral, Stress). If no face is detected, return 'Unknown'."),
  confidence: z.number().min(0).max(1).describe("The confidence score for the detected emotion, from 0 to 1. If no face, return 0."),
  feedback: z.string().describe("A short, encouraging, and empathetic feedback message for the user based on their emotion. If no face is detected, ask them to center their face in the camera."),
  suggestions: z.array(z.string()).describe("A list of 2-3 actionable suggestions to either maintain a positive mood or improve a negative one."),
  recommendedExercise: z.object({
    name: z.string().describe("The name of a recommended exercise (e.g., 'Mindful Breathing', '5-4-3-2-1 Grounding')."),
    description: z.string().describe("A brief description of how to perform the exercise."),
  }).describe("A specific, simple mindfulness or grounding exercise tailored to the user's emotion.")
});
export type DetectEmotionOutput = z.infer<typeof DetectEmotionOutputSchema>;

export async function detectEmotion(input: DetectEmotionInput): Promise<DetectEmotionOutput> {
  return detectEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmotionPrompt',
  input: { schema: DetectEmotionInputSchema },
  output: { schema: DetectEmotionOutputSchema },
  prompt: `You are an expert at analyzing human facial expressions for emotions. Look at the image provided and identify the dominant emotion being displayed.

Your analysis should be empathetic, supportive, and actionable.

- If a face is clearly visible, identify the primary emotion (like Happy, Sad, Neutral, Surprised, Angry, Stress).
- Provide a confidence score for your detection.
- Offer a brief, positive, and encouraging piece of feedback related to that emotion. For example, if they look happy, you could say "It's wonderful to see you shining so brightly!". If they look sad, you could say "It's okay to feel down sometimes. Remember to be kind to yourself."
- Based on the detected emotion, provide a list of 2-3 simple, actionable suggestions. For positive emotions, suggest ways to savor the feeling. For negative emotions, suggest constructive ways to process or improve their mood.
- Recommend one specific, easy-to-follow mindfulness or grounding exercise that is appropriate for the detected emotion. Give it a name and a short description.
- If no face is detected in the image, set the emotion to 'Unknown', confidence to 0, and provide feedback asking the user to make sure their face is centered and well-lit. All other fields should be empty strings or arrays.

Image to analyze: {{media url=imageDataUri}}`,
});

const detectEmotionFlow = ai.defineFlow(
  {
    name: 'detectEmotionFlow',
    inputSchema: DetectEmotionInputSchema,
    outputSchema: DetectEmotionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
