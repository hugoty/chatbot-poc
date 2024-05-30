import { Tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { JiraToolkit } from "./jira/index";
import { JiraAPIWrapper } from "./jiraAPIwrapper";
import dotenv from 'dotenv';
import { ChatAnthropic } from '@langchain/anthropic';
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages"
import { createRetrieverTool } from "langchain/tools/retriever";
import { getClient, embedding } from '../../clients/weaviateClient';
import { WeaviateStore } from "@langchain/weaviate";




import readline from 'readline';

dotenv.config();







export const run = async () => {
  try {
    console.log("Script démarré");


    let client = await getClient()

    const store = await WeaviateStore.fromExistingIndex(embedding, {
      client,
      indexName: "TextIndex", // Ensure this matches the name used in your setup
      textKey: "text",
      metadataKeys: [], // Adjust if you have specific metadata keys to use
    });

    const retriever = store.asRetriever(100)
    const retrieverTool = createRetrieverTool(retriever, {
      
      name: "ai_search",
      description:
        "Search for information about AI. For any questions about AI, you must use this tool!",
    } );


    const prompt = ChatPromptTemplate.fromMessages(
      [
       /* ["system", "use only the agent tools to return all the information from the assistant to create the answer to the user question from answer"],*/
        ["system", "Retourne les réponses des outils. Si le tool ai_search echoue, reporte son echec et ne cherche pas à sa place "],
        ["human", "{input}"],
       // ["placeholder", "{history}"],
        ["placeholder", "{agent_scratchpad}"],
        //["placeholder", "{chat_history}"],
      ]
    );
    let chatHistory: string = ""
    const llm = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
           temperature: -1,
    });

    // const llm = new ChatOpenAI({
    //   model: "gpt-4-turbo", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
    //   temperature: 0.5, // In Node.js defaults to process.env.OPENAI_API_KEY
    // });
    const jira = new JiraAPIWrapper({
      host: "https://chatbottest.atlassian.net",
      email: "ameni.lefi@esprit.tn",
      apiToken: process.env.ATLASSIAN_API_KEY,
    });
    console.log("API Wrapper Jira initialisé");

    const toolkit = new JiraToolkit(jira);
    console.log("Jira Toolkit chargé");
    let tools = [];
    tools.push(retrieverTool);

    
    let toolss = toolkit.tools;

     toolss.map(e => tools.push(e))

    const agent = createToolCallingAgent({ llm, tools, prompt });
    const agentExecutor = new AgentExecutor({ agent, tools, verbose: true });

    console.log("Agent chargé");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question('Votre question (ou tapez "exit" pour quitter) : ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          rl.close();
          return;
        }

        try {
          console.log(`Exécution avec l'input "${input}"...`);
          const result = await agentExecutor.invoke({ input: input 
          });
          console.log(`Résultat obtenu: ${result.output}`);
        } catch (error) {
          console.error("Erreur rencontrée :", error);
        }

        askQuestion();
      });
    };

    askQuestion();
  } catch (error) {
    console.error("Erreur rencontrée :", error);
  }
};

run();
