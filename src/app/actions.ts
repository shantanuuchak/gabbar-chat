
// src/app/actions.ts
"use server";

import { summarizeText, type SummarizeTextInput } from '@/ai/flows/summarize-text';
import { generateHeadline, type GenerateHeadlineInput } from '@/ai/flows/generate-headline';
import { conversationalAiChat, type ChatInput } from '@/ai/flows/chat-flow';
import {z} from 'genkit';

export interface AiActionResult {
  output: string | null;
  error: string | null;
}

export async function handleSummarizeText(formData: FormData): Promise<AiActionResult> {
  try {
    const text = formData.get('inputText') as string;
    if (!text || text.trim() === "") {
      return { output: null, error: 'Text to summarize cannot be empty.' };
    }
    const input: SummarizeTextInput = { text };
    const result = await summarizeText(input);
    return { output: result.summary, error: null };
  } catch (e: any) {
    console.error("Error in handleSummarizeText:", e);
    return { output: null, error: e.message || 'Failed to summarize text. Please try again.' };
  }
}

export async function handleGenerateHeadline(formData: FormData): Promise<AiActionResult> {
  try {
    const topic = formData.get('inputText') as string;
    if (!topic || topic.trim() === "") {
      return { output: null, error: 'Topic for headline cannot be empty.' };
    }
    const input: GenerateHeadlineInput = { topic };
    const result = await generateHeadline(input);
    return { output: result.headline, error: null };
  } catch (e: any) {
    console.error("Error in handleGenerateHeadline:", e);
    return { output: null, error: e.message || 'Failed to generate headline. Please try again.' };
  }
}

const ChatHistoryMessageSchemaFrontend = z.object({
  id: z.string(),
  text: z.string(),
  sender: z.enum(['user', 'ai']),
  name: z.string(),
  avatarUrl: z.string().optional(),
});

// Action for chat interaction, now with optional image data
export async function handleChatInteraction(formData: FormData): Promise<AiActionResult> {
  try {
    const userInput = formData.get('userInput') as string;
    const historyString = formData.get('history') as string | null;
    const imageDataUri = formData.get('imageDataUri') as string | null;

    // User input can be empty if an image is provided
    if ((!userInput || userInput.trim() === "") && !imageDataUri) {
      return { output: null, error: 'Message or image cannot be empty.' };
    }

    let historyForAI: ChatInput['history'] = [];
    if (historyString) {
      try {
        const parsedHistory = JSON.parse(historyString);
        const validatedHistory = z.array(ChatHistoryMessageSchemaFrontend).safeParse(parsedHistory);
        if (validatedHistory.success) {
          historyForAI = validatedHistory.data.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          }));
        } else {
          console.warn("Invalid history format received:", validatedHistory.error);
        }
      } catch (e) {
        console.error("Error parsing chat history:", e);
      }
    }
    

    const input: ChatInput = { 
      userInput: userInput || "", // Send empty string if only image is present
      history: historyForAI,
      imageDataUri: imageDataUri || undefined, // Pass undefined if null
    };
    
    const result = await conversationalAiChat(input);
    return { output: result.response, error: null };

  } catch (e: any) {
    console.error("Error in handleChatInteraction:", e);
    return { output: null, error: e.message || 'Failed to get AI response. Please try again.' };
  }
}

