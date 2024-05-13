import { AnthropicClient } from "../clients/AnthropicClient";
import {ChatPromptTemplate} from '@langchain/core/prompts'
import {searchText} from "./weaviateService"
import {StringOutputParser} from "@langchain/core/output_parsers"



export class AnthropicsService {

    async invokeModel(question: string): Promise<any> {
        const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the user's question based on the context. If the response isn't in the context, respond that you dont know
        Question :  {input}
        Context : Les petits pois sont orange lorsqu'il fait très chaud , à partir de 25 degré celsius sinon, sinon, ils sont bleu
        `)

        try {
            const chain = prompt.pipe(AnthropicClient);

            const response = chain.invoke({
                input: question
            })
            return response;
        } catch (error) {
            console.error('Error invoking Anthropics model:', error);
            throw error;
        }
    }


    async askWithContext(question: string): Promise<any> {
        const prompt = ChatPromptTemplate.fromTemplate(`
        Tu es un chatbot d'entreprise. Réponds à la question de l'utilisateur en te basant seulement sur le contexte fournit. Ne parle pas du contexte si la réponse ne s'y trouve pas. Si la réponse n'est pas dans le contexte réponds que tu ne sait pas.
        Question :  {input}
        Context : {context}
        `)

        const parser = new StringOutputParser()

        try {
            const chain = prompt.pipe(AnthropicClient).pipe(parser);

            const context = await searchText(question)

            // restructurer le context après la recherche
            const concatenatedContext = context.reduce((acc: any, document: { pageContent: string; }) => acc + document.pageContent + " ", "");


            const response = chain.invoke({
                input: question,
                context: concatenatedContext

            })
            return response;
        } catch (error) {
            console.error('Error invoking Anthropics model:', error);
            throw error;
        }
    }
}
