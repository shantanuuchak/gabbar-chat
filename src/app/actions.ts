// src/app/actions.ts
"use server";

import { summarizeText, type SummarizeTextInput } from '@/ai/flows/summarize-text';
import { generateHeadline, type GenerateHeadlineInput } from '@/ai/flows/generate-headline';

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
