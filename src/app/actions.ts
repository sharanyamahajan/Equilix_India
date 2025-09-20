'use server';

import { suggestHtmlImprovements } from '@/ai/flows/suggest-html-improvements';
import { analyzeWellness } from '@/ai/flows/analyze-wellness';
import type { WellnessSurveyInput } from '@/ai/schemas/wellness';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import { aiFriend } from '@/ai/flows/ai-friend';
import type { AIFriendInput } from '@/ai/schemas/ai-friend';
import { createAITwin as createAITwinFlow, type CreateAITwinInput } from '@/ai/flows/create-ai-twin';
import { learnFromHistory as learnFromHistoryFlow, type LearnFromHistoryInput } from '@/ai/flows/learn-from-history';


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

export async function getAIFriendResponse(input: AIFriendInput) {
  try {
    const result = await aiFriend(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error in getAIFriendResponse:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get response from AI friend. Reason: ${errorMessage}` };
  }
}

export async function createAITwin(input: CreateAITwinInput) {
  try {
    const result = await createAITwinFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'Failed to create AI twin from the AI model.' };
  }
}

export async function learnFromJournal(input: LearnFromHistoryInput) {
    try {
        const result = await learnFromHistoryFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('AI Error:', error);
        return { success: false, error: 'Failed to learn from journal entries.' };
    }
}
