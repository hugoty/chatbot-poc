const { ChatAnthropic } = require('@langchain/anthropic');

const apiKey = "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";

export const AnthropicClient = new ChatAnthropic({
    apiKey: apiKey,
    model: 'claude-3-sonnet-20240229',
    maxTokens: 1024,
    temperature: 0.9
});


