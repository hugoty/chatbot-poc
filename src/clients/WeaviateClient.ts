// insrtText.ts
import { ApiKey } from 'weaviate-ts-client';
import { default as weaviate } from 'weaviate-ts-client';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';




dotenv.config();



export const client = (weaviate as any).client({
    scheme: process.env.WEAVIATE_SCHEME || 'https',
    host: process.env.WEAVIATE_HOST || process.env.DB_URL,
    apiKey:new ApiKey(process.env.WEAVIATE_API_KEY ||"ghylkjhgv")
  });

  export async function getClient(): Promise<any> {
    return await client;
  }

export const embedding =  new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  batchSize: 512,  // As per your setup, adjust if needed
  model: "text-embedding-3-large",
})


