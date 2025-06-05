'use server';
/**
 * @fileOverview A simple chat flow for conversational AI.
 *
 * - chatFlow - A function that handles chat interactions.
 * - ChatInput - The input type for the chatFlow function.
 * - ChatOutput - The return type for the chatFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schemas for input and output
// History is an array of previous messages (optional for now)
const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});

const ChatInputSchema = z.object({
  userInput: z.string().describe('The current message from the user.'),
  history: z.array(ChatHistoryMessageSchema).optional().describe('The conversation history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


// Main exported function that clients will call
export async function conversationalAiChat(input: ChatInput): Promise<ChatOutput> {
  return chatGenkitFlow(input);
}

// Define the prompt for Genkit
// The prompt takes the user's input and optionally the history
const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: (input) => {
    let fullPrompt = `You are a helpful AI assistant. Respond to the user's message concisely.`;
    
    if (input.history && input.history.length > 0) {
      fullPrompt += "\n\nConversation History:\n";
      input.history.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.parts.map(p => p.text).join('')}\n`;
      });
    }
    
    fullPrompt += `\n\nUser: {{{userInput}}}`;
    fullPrompt += `\n\nAI Response:`; // To guide the model for the response structure.
    return fullPrompt;
  },
  config: {
    model: 'googleai/gemini-2.0-flash', // Ensure this model supports chat/history if needed
     // Adjust safety settings if necessary
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  }
});


// Define the Genkit flow
const chatGenkitFlow = ai.defineFlow(
  {
    name: 'chatGenkitFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await chatPrompt(input);
    const outputText = llmResponse.output?.response;

    if (!outputText) {
      // Fallback or error handling if the model doesn't return the expected structure
      console.error("AI did not return a valid response object:", llmResponse);
      return { response: "I'm sorry, I couldn't generate a response at this time." };
    }
    
    return { response: outputText };
  }
);
