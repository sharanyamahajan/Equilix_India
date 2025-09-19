'use server';

import { suggestHtmlImprovements } from '@/ai/flows/suggest-html-improvements';

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
