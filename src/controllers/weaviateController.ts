// weaviateController.ts
import { Request, Response } from 'express';
import { insertText, searchText, insertTextFromURL } from '../services/weaviateService'; // Include searchText here

export async function handleInsertText(req: Request, res: Response): Promise<void> {
    try {
        const text = req.body.text;
        if (!text) {
            res.status(400).send({ error: 'No text provided' });
            return;
        }

        await insertText(text);
        res.status(200).send({ message: 'Text successfully inserted into Weaviate' });
    } catch (error) {
        console.error('Failed to insert text:', error);
        res.status(500).send({ error: 'Failed to insert text' });
    }
}

export async function handleSearchText(req: Request, res: Response): Promise<void> {
    try {
        const query = req.body.text as string; // Using query to get the text parameter
        if (!query) {
            res.status(400).send({ error: 'No query text provided' });
            return;
        }

        const results = await searchText(query);
        res.status(200).send({ results }); // Sending back the search results
    } catch (error) {
        console.error('Failed to search text:', error);
        res.status(500).send({ error: 'Failed to search text' });
    }
}


export async function handleInsertTextFromURL(req: Request, res: Response): Promise<void> {
    try {
        const url = req.body.url;
        if (!url) {
            res.status(400).send({ error: 'No url provided' });
            return;
        }

        await insertTextFromURL(url);
        res.status(200).send({ message: 'Text from url successfully inserted into Weaviate' });
    } catch (error) {
        console.error('Failed to insert text from url:', error);
        res.status(500).send({ error: 'Failed to insert text from url' });
    }
}


// export async function handleCleanDB(req: Request, res: Response): Promise<void> {
//     try {
        
//         await cleanDB();
//         res.status(200).send({ message: 'db cleanned successfully' });
//     } catch (error) {
//         console.error('Failed to clean db:', error);
//         res.status(500).send({ error: 'Failed to clean db' });
//     }
// }
