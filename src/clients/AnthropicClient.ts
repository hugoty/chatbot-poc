import { ChatAnthropic } from '@langchain/anthropic';
import dotenv from 'dotenv';



dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;
export const AnthropicClient = new ChatAnthropic({
    apiKey: apiKey,
    model: 'claude-3-sonnet-20240229',
    maxTokens: 1024,
    temperature: 0.9
});


