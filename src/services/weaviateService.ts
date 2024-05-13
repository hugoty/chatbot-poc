const { WeaviateStore } = require('@langchain/weaviate');
import { embedding } from "../clients/WeaviateClient";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
const {ApiKey} = require('weaviate-ts-client');
const {default: weaviate}  = require('weaviate-ts-client');
const { OpenAIEmbeddings } = require('@langchain/openai')

export const client = (weaviate as any).client({
  scheme: process.env.WEAVIATE_SCHEME || 'https',
  host: process.env.WEAVIATE_HOST || 'chatbot-6cesrgea.grpc.weaviate.network',
  apiKey:new ApiKey(process.env.WEAVIATE_API_KEY )
});
 async function insertText(text : string) {
  // Connexion au client Weaviate

  // Création du store Weaviate pour gérer les documents
  await WeaviateStore.fromTexts(
    [text],
    [{}],  // Metadata vide pour cet exemple, peut être étendu selon les besoins
    embedding,  // Utilisation des embeddings d'OpenAI
    {
      client,
      indexName: "TextIndex",  // Nom de l'index dans Weaviate
      textKey: "text",
      metadataKeys: [],
    }
  );

  console.log("Texte inséré avec succès dans Weaviate.");
}


 async function searchText(text: string) {
  // Initialize the WeaviateStore with the existing index
  const store = await WeaviateStore.fromExistingIndex(
    embedding,
    {
    client,
    indexName: "TextIndex",  // Ensure this matches the name used in your setup
    textKey: "text",
    metadataKeys: [],  // Adjust if you have specific metadata keys to use
  });

  // Perform a similarity search in the Weaviate index
  try {
    const results = await store.similaritySearch(text, 10);  // Adjust the number of results as needed
    console.log("Search Results:", results);
    return results;
  } catch (error) {
    console.error("Error during search:", error);
    throw error;  // Properly handle the error
  }
}


  async function insertTextFromURL(url: string) {
      const loader = new CheerioWebBaseLoader(url)
      const docs = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:200,
        chunkOverlap:20
      })

      const splitDocs = await splitter.splitDocuments(docs)

     const store =  await WeaviateStore.fromExistingIndex(
 // Metadata vide pour cet exemple, peut être étendu selon les besoins
        embedding,  // Utilisation des embeddings d'OpenAI
        {
          client,
          indexName: "TextIndex",  // Nom de l'index dans Weaviate
          textKey: "text",
          metadataKeys: [],
        }
      );
      store.addDocuments(splitDocs)

  }
export {searchText, insertText , insertTextFromURL}// import { WeaviateStore } from '@langchain/weaviate';
// import { getClient, embedding } from "../clients/WeaviateClient";
// import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
// import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
// import {CustomTextSplitter} from "../utils/splitter/splitter"






//  async function insertText(text : string) {
//   const client = await getClient()

//   // Connexion au client Weaviate

//   // Création du store Weaviate pour gérer les documents
//   await WeaviateStore.fromTexts(

//     [text],
//     [{}],  // Metadata vide pour cet exemple, peut être étendu selon les besoins
//     embedding,  // Utilisation des embeddings d'OpenAI
//     {
//       client,
//       indexName: "TextIndex",  // Nom de l'index dans Weaviate
//       textKey: "text",
//       metadataKeys: [],
//     }
//   );

//   console.log("Texte inséré avec succès dans Weaviate.");
// }


//  async function searchText(text: string) {
//   const client = await getClient()

//   // Initialize the WeaviateStore with the existing index
//   const store = await WeaviateStore.fromExistingIndex(
//     embedding,
//     {
//     client,
//     indexName: "TextIndex",  // Ensure this matches the name used in your setup
//     textKey: "text",
//     metadataKeys: [],  // Adjust if you have specific metadata keys to use
//   });

//   // Perform a similarity search in the Weaviate index
//   try {
//     const results = await store.similaritySearch(text, 10);  // Adjust the number of results as needed
//     console.log("Search Results:", results);
//     return results;
//   } catch (error) {
//     console.error("Error during search:", error);
//     throw error;  // Properly handle the error
//   }
// }


//   async function insertTextFromURL(url: string) {


//     const client = await getClient()

//       const loader = new CheerioWebBaseLoader(url)
//       const docs = await loader.load();
//       // const splitter = new RecursiveCharacterTextSplitter({
//       //   chunkSize:200,
//       //   chunkOverlap:20
//       // })

//       const splitter = new CustomTextSplitter()

//       const splitDocs = await splitter.splitDocuments(docs)
//       console.log(splitDocs)

      
//       const store = await WeaviateStore.fromExistingIndex(
//         embedding,
//         {
//         client,
//         indexName: "TextIndex",  // Ensure this matches the name used in your setup
//         textKey: "text",
//         metadataKeys: [],  // Adjust if you have specific metadata keys to use
//       });
//       console.log("store ok")
//       await store.addDocuments(splitDocs)

//   }


//   async function cleanDB(){
//     const client = await getClient()


//     const store = await WeaviateStore.fromExistingIndex(
//       embedding,
//       {
//       client,
//       indexName: "TextIndex",  // Ensure this matches the name used in your setup
//       textKey: "text",
//       metadataKeys: [],  // Adjust if you have specific metadata keys to use
//     });


//    await store.delete(
//     {
//       filter: {
//         where: {
//           operator: "Equal",
//           valueText: "",
//         },
//       }
//     }
//    );

//   }


// export {searchText, insertText , insertTextFromURL, cleanDB}