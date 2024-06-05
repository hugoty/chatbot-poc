import { Tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { JiraToolkit } from "./jira/index";
import { JiraAPIWrapper } from "./jiraAPIwrapper";
import dotenv from 'dotenv';
import { ChatAnthropic } from '@langchain/anthropic';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createRetrieverTool } from 'langchain/tools/retriever';
import { getClient, embedding } from '../../clients/weaviateClient';
import { WeaviateStore } from '@langchain/weaviate';

dotenv.config();

export const runAgent = async (input: string) => {
  try {
    console.log('Script démarré');

    let client = await getClient();

    const store = await WeaviateStore.fromExistingIndex(embedding, {
      client,
      indexName: 'TextIndex',
      textKey: 'text',
      metadataKeys: [],
    });

    const retriever = store.asRetriever(100);
    const retrieverTool = createRetrieverTool(retriever, {
      name: 'ai_search',
      description: 'For any questions about, you must use this tool!',
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'Retourne les réponses des outils. Si le tool ai_search echoue, reporte son  et retourne que tu ne sais pas '],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    const llm = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
      temperature: -1,
    });

    const jira = new JiraAPIWrapper({
      host: 'https://chatbottest.atlassian.net',
      email: 'ameni.lefi@esprit.tn',
      apiToken: process.env.ATLASSIAN_API_KEY,
    });

    const toolkit = new JiraToolkit(jira);
    let tools = [retrieverTool, ...toolkit.tools];

    const agent = createToolCallingAgent({ llm, tools, prompt });
    const agentExecutor = new AgentExecutor({ agent, tools, verbose: true });

    const result = await agentExecutor.invoke({ input });
    return result;
  } catch (error) {
    console.error('Erreur rencontrée :', error);
    throw error;
  }
};
