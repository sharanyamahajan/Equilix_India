'use server';
/**
 * @fileOverview A conversational AI friend that provides text and audio responses.
 *
 * - aiFriend - A function that provides conversational responses and audio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';
import { AIFriendInputSchema, AIFriendOutputSchema, type AIFriendInput, type AIFriendOutput } from '@/ai/schemas/aura';


export async function aiFriend(input: AIFriendInput): Promise<AIFriendOutput> {
  return aiFriendFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const auraSystemPrompt = `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm, suitable for being spoken aloud.`;

const aiFriendFlow = ai.defineFlow(
  {
    name: 'aiFriendFlow',
    inputSchema: AIFriendInputSchema,
    outputSchema: AIFriendOutputSchema,
  },
  async ({ history, message }) => {
    const fullHistory = [
      ...(history?.map(msg => ({ role: msg.role, content: [{ text: msg.text }] })) || []),
    ];

    const textResponse = await ai.generate({
      system: auraSystemPrompt,
      history: fullHistory,
      prompt: message,
    });
    
    const reply = textResponse.text;

    if (!reply) {
      const fallbackReply = "I'm not sure how to respond to that. Can you try rephrasing?";
       const { media: fallbackAudio } = await ai.generate({
          model: googleAI.model('gemini-2.5-flash-preview-tts'),
          config: { responseModalities: ['AUDIO'] },
          prompt: fallbackReply,
      });

      const fallbackAudioBuffer = Buffer.from(fallbackAudio!.url.substring(fallbackAudio!.url.indexOf(',') + 1), 'base64');

      return {
        reply: fallbackReply,
        audio: 'data:audio/wav;base64,' + (await toWav(fallbackAudioBuffer)),
      };
    }
    
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
            responseModalities: ['AUDIO'],
        },
        prompt: reply,
    });

    if (!media) {
        throw new Error("Audio generation failed.");
    }
    
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');

    return { 
        reply,
        audio: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
