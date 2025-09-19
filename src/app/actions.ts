'use server';

import { suggestHtmlImprovements } from '@/ai/flows/suggest-html-improvements';
import { analyzeWellness } from '@/ai/flows/analyze-wellness';
import type { WellnessSurveyInput } from '@/ai/schemas/wellness';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import { aiFriend } from '@/ai/flows/ai-friend';

export async function getHtmlImprovements(htmlContent: string) {
  if (!htmlContent) {
    return { success: false, error: 'HTML content cannot be empty.' };
  }
  
  try {
    const result = await suggestHtmlImprovements({ htmlContent });
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'Failed to get improvements from the AI model.' };
  }
}

export async function getWellnessAnalysis(surveyData: WellnessSurveyInput) {
  try {
    const result = await analyzeWellness(surveyData);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'Failed to get analysis from the AI model.' };
  }
}

export async function getEmotionDetection(imageDataUri: string) {
  if (!imageDataUri) {
    return { success: false, error: 'Image data cannot be empty.' };
  }

  try {
    const result = await detectEmotion({ imageDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'Failed to detect emotion from the AI model.' };
  }
}

export async function getAIFriendResponse(message: string) {
  if (!message) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  try {
    const result = await aiFriend({ message });
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'Failed to get response from AI friend.' };
  }
}
