import { WeaviateStore } from "@langchain/weaviate";
import { getClient, embedding, client } from "../clients/weaviateClient";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CustomTextSplitter } from "../utils/splitter/splitter";
import dotenv from "dotenv";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

dotenv.config();

async function insertTextToDB(text: string) {
  const client = await getClient();

  // Connexion au client Weaviate

  // Création du store Weaviate pour gérer les documents
  await WeaviateStore.fromTexts(
    [text],
    [{}], // Metadata vide pour cet exemple, peut être étendu selon les besoins
    embedding, // Utilisation des embeddings d'OpenAI
    {
      client,
      indexName: "TextIndex", // Nom de l'index dans Weaviate
      textKey: "text",
      metadataKeys: [],
    }
  );

  console.log("Texte inséré avec succès dans Weaviate.");
}

async function searchInDB(text: string) {
  const client = await getClient();

  // Initialize the WeaviateStore with the existing index
  const store = await WeaviateStore.fromExistingIndex(embedding, {
    client,
    indexName: "TextIndex", // Ensure this matches the name used in your setup
    textKey: "text",
    metadataKeys: [], // Adjust if you have specific metadata keys to use
  });

  // Perform a similarity search in the Weaviate index
  try {
    const results = await store.similaritySearch(text, 50); // Adjust the number of results as needed
    console.log("Search Results:", results);
    return results;
  } catch (error) {
    console.error("Error during search:", error);
    throw error; // Properly handle the error
  }
}

async function insertTextFromURLToDB(url: string) {
  const client = await getClient();

  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  // const splitter = new RecursiveCharacterTextSplitter({
  //   chunkSize:200,
  //   chunkOverlap:20
  // })

  //const splitter = new CustomTextSplitter()

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 30,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  const store = await WeaviateStore.fromExistingIndex(embedding, {
    client,
    indexName: "TextIndex", // Ensure this matches the name used in your setup
    textKey: "text",
    metadataKeys: [], // Adjust if you have specific metadata keys to use
  });
  console.log(splitDocs);
  await store.addDocuments(splitDocs);
}

async function processAndInsertPDFToDB(pdfPath: string) {
  const client = await getClient();
  try {
    // Charger et analyser le PDF
    const loader = new PDFLoader(pdfPath, { splitPages: false });
    const docs = await loader.load();

    // Nettoyer les documents pour n'inclure que le champ source dans les métadonnées
    const cleanedDocs = docs.map((doc: any) => ({
      pageContent: doc.pageContent,
      metadata: {
        source: doc.metadata.source,
      },
    }));

    // Diviser les documents en morceaux
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 30,
    });
    const splitDocs = await splitter.splitDocuments(cleanedDocs);
    splitDocs.map((e) => {
      console.log(e.pageContent + "//");
    });
    const store = await WeaviateStore.fromExistingIndex(embedding, {
      client,
      indexName: "TextIndex", // Assurez-vous que cela correspond au nom utilisé dans votre configuration
      textKey: "text",
      metadataKeys: [], // Inclure uniquement la clé de métadonnée 'source'
    });
    console.log(splitDocs);
    await store.addDocuments(splitDocs);

    console.log("PDF processed and inserted successfully into Weaviate.");
  } catch (error) {
    console.error("Error processing and inserting PDF:", error);
    throw error; // Gérer correctement l'erreur
  }
}

async function clearDB() {
  const client = await getClient();

  const store = await WeaviateStore.fromExistingIndex(embedding, {
    client,
    indexName: "TextIndex", // Ensure this matches the name used in your setup
    textKey: "text",
    metadataKeys: [], // Adjust if you have specific metadata keys to use
  });

  await store.delete({
    filter: {
      where: {
        operator: "Equal",
        valueText: "",
      },
    },
  });
}

export {
  searchInDB,
  processAndInsertPDFToDB,
  insertTextToDB,
  insertTextFromURLToDB,
  clearDB,
};

// export async function insertText(text: string) {
//   const client = await getWeaviateDB();
//   try {
//       await client.data
//           .creator()
//           .withClassName("TextVector")
//           .withProperties({ text: text})
//           .do();
//   } catch (err: any) {
//       console.error(`Error saving text into Weaviate:`, err);
//       // Throw the error to be caught by handleInsertText.
//       throw new Error('Error during Weaviate insertion');
//   }
// }
