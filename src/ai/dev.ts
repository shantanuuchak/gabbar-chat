import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/generate-headline.ts';
import '@/ai/flows/chat-flow.ts'; // Added new chat flow
