import { AnthropicClient } from "../clients/AnthropicClient";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { searchInDB } from "./dbService";  // Méthode renommée
import { StringOutputParser } from "@langchain/core/output_parsers";

export class AIService {
  async invokeModel(question: string): Promise<any> {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the user's question
        Question :  {input}
    `);

    try {
      console.log("go");
      const chain = prompt.pipe(AnthropicClient);

      const response = await chain.invoke({
        input: question,
      });

      return response;
    } catch (error) {
      console.error("Error invoking AI model:", error);
      throw error;
    }
  }

  async askWithContext(question: string): Promise<any> {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Instruction Importantes : N'utilise pas le mot contexte dans ta réponse. Tu es un chatbot d'entreprise. Réponds à la question de l'utilisateur en te basant seulement sur le contexte fourni.

        Contexte : {context}

        Question : {input}

        Réponse :
    `);

    const parser = new StringOutputParser();

    try {
      const chain = prompt.pipe(AnthropicClient);

      const context = await searchInDB(question);

      // Restructurer le contexte après la recherche
      const concatenatedContext = context.reduce(
        (acc: any, document: { pageContent: string }) =>
          acc + document.pageContent + " ",
        ""
      );

      const response = chain.invoke({
        input: question,
        context: concatenatedContext,
      });

      return response;
    } catch (error) {
      console.error("Error invoking AI model:", error);
      throw error;
    }
  }

  async classifyRequest(question: string): Promise<any> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      Classify the following text as either "demande ticket jira" , "demande d'action" or "demande d'information".

        Text : {input}

        Class :
    `);

    const parser = new StringOutputParser();

    try {
      console.log("go");
      const chain = prompt.pipe(AnthropicClient);

      const response = await chain.invoke({
        input: question,
      });

      return response;
    } catch (error) {
      console.error("Error invoking AI model:", error);
      throw error;
    }
  }
  
  async detectTaskTypeAndGenerateDescription(input: string): Promise<{ taskType: string, description: string }> {
    const prompt = `
        You are an assistant that helps classify tasks and generate descriptions for Jira issues.
        Based on the following input, determine the task type and provide a detailed description.

        Input: {input}

        Output format:
        Task Type: <Task Type>
        Description: <Description>
    `;

    try {
        const chain = ChatPromptTemplate.fromTemplate(prompt).pipe(AnthropicClient);

        const response = await chain.invoke({
            input: input,
        });

        const content = response.content.toString();
        const lines = content.split('\n');

        const taskTypeLine = lines[0].trim();
        const descriptionLine = lines[1].trim();

        const taskType = taskTypeLine.split(': ')[1].trim();
        const description = descriptionLine.split(': ')[1].trim();

        return { taskType, description };
    } catch (error) {
        console.error('Error invoking AI model:', error);
        throw error;
    }
}


}