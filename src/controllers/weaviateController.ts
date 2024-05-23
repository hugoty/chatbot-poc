// weaviateController.ts
import { Request, Response } from 'express';
import { insertText,processAndInsertPDF, searchText, insertTextFromURL, cleanDB } from '../services/weaviateService'; // Include searchText here
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { Express } from 'express';




export async function handleInsertText(req: Request, res: Response): Promise<void> {
    try {
        const text = req.body.text;
        if (!text) {
            res.status(400).send({ error: 'No text provided' });
            return;
        }

        // Wait for insertText to complete and catch any errors it throws.
        await insertText(text);
        res.status(200).send({ message: 'Text successfully inserted into Weaviate' });
    } catch (error) {
        console.error('Failed to insert text:', error);
        // Send a 500 status code if an error is thrown by insertText.
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


export async function handleCleanDB(req: Request, res: Response): Promise<void> {
    try {
        
        await cleanDB();
        res.status(200).send({ message: 'db cleanned successfully' });
    } catch (error) {
        console.error('Failed to clean db:', error);
        res.status(500).send({ error: 'Failed to clean db' });
    }
}



interface MulterRequest extends Request {
    file: Express.Multer.File;
}
export async function handleInsertTextFromPDF(req: Request, res: Response): Promise<void> {
    try {
        // Cast req to MulterRequest to access the file property

        const multerReq= req as MulterRequest;

        if (!multerReq) {
            res.status(400).send('No file uploaded.');
            return;
        }

        const file = multerReq.file;

        console.log("file :" + file )

        const tempPath = path.join(tmpdir(), file.originalname);
        fs.writeFileSync(tempPath, file.buffer);

        await processAndInsertPDF(tempPath);

        fs.unlinkSync(tempPath);

        res.status(200).send('PDF processed and inserted successfully into Weaviate.');
    } catch (error) {
        console.error("Error processing and inserting PDF:", error);
        res.status(500).send('Error processing the PDF.');
    }
}