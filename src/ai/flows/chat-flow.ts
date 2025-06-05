
'use server';
/**
 * @fileOverview A simple chat flow for conversational AI, with optional image input.
 *
 * - conversationalAiChat - A function that handles chat interactions.
 * - ChatInput - The input type for the conversationalAiChat function.
 * - ChatOutput - The return type for the conversationalAiChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schemas for input and output
const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});

const ChatInputSchema = z.object({
  userInput: z.string().describe('The current message from the user.'),
  history: z.array(ChatHistoryMessageSchema).optional().describe('The conversation history.'),
  imageDataUri: z.string().optional().describe("An optional image from the user's camera, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
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
const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: (input) => {
    // This function constructs the prompt string that will be processed by Handlebars.
    // Handlebars syntax like {{{userInput}}} and {{media url=imageDataUri}} will be resolved
    // against the `input` object provided to the flow.
    
    let fullPrompt = `You are a helpful AI assistant. Respond to the user's message.`;
    
    if (input.history && input.history.length > 0) {
      fullPrompt += "\n\nConversation History:\n";
      input.history.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.parts.map(p => p.text).join('')}\n`;
      });
    }
    
    fullPrompt += `\n\nUser: {{{userInput}}}`;

    if (input.imageDataUri) {
      // If an image is provided, the {{media}} helper will embed it.
      // The context for this Handlebars template is the `input` object.
      fullPrompt += `\n[The user has also provided an image from their camera. Analyze the image and incorporate your observations into the response to the user's text. If the user's text doesn't seem to relate to the image, briefly describe the image and then address the text query.]\n{{media url=imageDataUri}}`;
    }
    
    fullPrompt += `\n\nAI Response:`;
    return fullPrompt;
  },
  config: {
    model: 'googleai/gemini-2.0-flash', // This model supports multimodal input
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
    const llmResponse = await chatPrompt(input); // input here contains userInput, history, and potentially imageDataUri
    const outputText = llmResponse.output?.response;

    if (!outputText) {
      console.error("AI did not return a valid response object:", llmResponse);
      return { response: "I'm sorry, I couldn't generate a response at this time." };
    }
    
    return { response: outputText };
  }
);

