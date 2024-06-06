import { JiraToolkit } from "../utils/jira/jira";
import { JiraAPIWrapper } from "../utils/jira/jiraAPIwrapper";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";

import { createRetrieverTool } from "langchain/tools/retriever";
import { getClient, embedding } from '../clients/weaviateClient';
import { WeaviateStore } from "@langchain/weaviate";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';

dotenv.config();

class AgentService {
  private agentExecutor: any;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    let client = await getClient();
    const store = await WeaviateStore.fromExistingIndex(embedding, {
      client,
      indexName: "TextIndex",
      textKey: "text",
      metadataKeys: [],
    });
    const retriever = store.asRetriever(100);
    const retrieverTool = createRetrieverTool(retriever, {
      name: "ai_search",
      description: "Search for information about AI. For any questions about AI, you must use this tool! Retourn only the result",
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `Choisi l'outil le plus adapté parmi les outils à ta disposition. Restitue la réponse des outils à l'utilisateur. Si l'action te renvoie un message positif, alors retourne une réponse pour décrire le succès de l'action commençant par Final Answer :`],
      ["human", "{input}"],
      new MessagesPlaceholder("chat_history"),
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const llm = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
      temperature: -1,
    });

    const modelForFunctionCalling = new ChatOpenAI({
      model: "gpt-4",
      temperature: 0,
    });

    const jira = new JiraAPIWrapper({
      host: "https://chatbottest.atlassian.net",
      email: "ameni.lefi@esprit.tn",
      apiToken: process.env.ATLASSIAN_API_KEY,
    });

    const toolkit = new JiraToolkit(jira);

    let tools = [];
    tools.push(retrieverTool);
    toolkit.tools.forEach(tool => tools.push(tool));

    const agent = createToolCallingAgent({ llm, tools, prompt });
    this.agentExecutor = new AgentExecutor({ agent, tools, verbose: true, maxIterations: 10 });
  }

  public async execute(input: string, chatHistory: BaseMessage[]) {
    // Add user input to history
    chatHistory.push(new HumanMessage(input));

    const result = await this.agentExecutor.invoke({
      input,
      chat_history: chatHistory,
    });

    // Add agent response to history
    chatHistory.push(new AIMessage(result.output));

    return result.output;
  }
}

export default new AgentService();
