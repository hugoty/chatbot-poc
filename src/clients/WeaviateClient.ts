// insrtText.ts
const {ApiKey} = require('weaviate-ts-client');
const {default: weaviate}  = require('weaviate-ts-client');
const { OpenAIEmbeddings } = require('@langchain/openai')
import dotenv from 'dotenv';




dotenv.config();



export const client = (weaviate as any).client({
    scheme: process.env.WEAVIATE_SCHEME || 'https',
    host: process.env.WEAVIATE_HOST || 'chatbot-6cesrgea.grpc.weaviate.network',
    apiKey:new ApiKey(process.env.WEAVIATE_API_KEY)
  });

  export async function getClient(): Promise<any> {
    return await client;
  }

export const embedding =  new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  batchSize: 512,  // As per your setup, adjust if needed
  model: "text-embedding-3-large",
})
