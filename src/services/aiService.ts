import { AnthropicClient } from "../clients/anthropicClient";
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
}
