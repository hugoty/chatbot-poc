// index.ts
import express from 'express';
import multer from 'multer';
import { handleQuestion, handleQuestionWithContext } from '../controllers/anthropicController';
import {  handleInsertText, handleInsertTextFromPDF, handleSearchText, handleInsertTextFromURL, handleCleanDB } from '../controllers/weaviateController';


const upload = multer({
    storage: multer.memoryStorage(), // Utilisez la mémoire pour stocker les fichiers temporairement
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille du fichier (10 MB par exemple)
});

const router = express.Router();

router.post('/ask', handleQuestion);

router.post('/search', handleSearchText)

// Sub-router for handling requests related to Weaviate service
router.post('/insert', handleInsertText);

router.post('/fromURL', handleInsertTextFromURL)

router.post('/fromPDF', upload.single('file'), handleInsertTextFromPDF)


router.delete('/clean', handleCleanDB)

router.post('/contextAsk', handleQuestionWithContext)

export default router;
