import { Request, Response } from 'express';
import { insertTextToDB, processAndInsertPDFToDB, searchInDB, insertTextFromURLToDB, clearDB } from '../services/dbService';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { Express } from 'express';
import multer from 'multer';



const upload = multer({
    limits: { fileSize: 25 * 1024 * 1024 }, // Limite de taille de fichier de 25MB
  });
export async function handleInsertText(req: Request, res: Response): Promise<void> {
    try {
        const text = req.body.text;
        if (!text) {
            res.status(400).send({ error: 'No text provided' });
            return;
        }

        // Wait for insertTextToDB to complete and catch any errors it throws.
        await insertTextToDB(text);
        res.status(200).send({ message: 'Text successfully inserted into Weaviate' });
    } catch (error) {
        console.error('Failed to insert text:', error);
        // Send a 500 status code if an error is thrown by insertTextToDB.
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

        const results = await searchInDB(query);
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
            res.status(400).send({ error: 'No URL provided' });
            return;
        }

        await insertTextFromURLToDB(url);
        res.status(200).send({ message: 'Text from URL successfully inserted into Weaviate' });
    } catch (error) {
        console.error('Failed to insert text from URL:', error);
        res.status(500).send({ error: 'Failed to insert text from URL' });
    }
}

export async function handleClearDB(req: Request, res: Response): Promise<void> {
    try {
        await clearDB();
        res.status(200).send({ message: 'Database cleaned successfully' });
    } catch (error) {
        console.error('Failed to clean database:', error);
        res.status(500).send({ error: 'Failed to clean database' });
    }
}

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

export const handleInsertTextFromPDF = [
    upload.single('file'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        if (!req.file) {
          res.status(400).send('No file uploaded.');
          return;
        }
  
        const file = req.file;
        const tempPath = path.join(tmpdir(), file.originalname);
        fs.writeFileSync(tempPath, file.buffer);
  
        await processAndInsertPDFToDB(tempPath);
        fs.unlinkSync(tempPath);
  
        res.status(200).send({ result: 'PDF processed and inserted successfully into Weaviate.' });
      } catch (error: any) {
        if (error instanceof multer.MulterError) {
          console.error('Multer error:', error);
          res.status(400).send(`Multer error: ${error.message}`);
        } else if (error.message === 'Unexpected end of form') {
          console.error('Form error:', error);
          res.status(400).send('Unexpected end of form. Please try again.');
        } else {
          console.error('Error processing and inserting PDF:', error);
          res.status(500).send('Error processing the PDF.');
        }
      }
    },
  ];