import { ChatAnthropic } from '@langchain/anthropic';
import dotenv from 'dotenv';



dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;
export const AnthropicClient = new ChatAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-haiku-20240307',
    maxTokens: 1024,
    temperature: 0.3
});


