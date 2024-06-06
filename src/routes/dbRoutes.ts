// dbRoutes.ts
import express from 'express';
import multer from 'multer';
import { handleInsertText, handleInsertTextFromPDF, handleSearchText, handleInsertTextFromURL, handleClearDB } from '../controllers/dbController';

const upload = multer({
    storage: multer.memoryStorage(), // Utilisez la mémoire pour stocker les fichiers temporairement
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille du fichier (10 MB par exemple)
});

const dbRouter = express.Router();

dbRouter.post('/insert', handleInsertText);
dbRouter.post('/fromURL', handleInsertTextFromURL);
dbRouter.post('/fromPDF', handleInsertTextFromPDF);
dbRouter.post('/search', handleSearchText);
dbRouter.delete('/clean', handleClearDB);

export default dbRouter;
