// index.ts
import express from 'express';
import { handleQuestion, handleQuestionWithContext } from '../controllers/anthropicController';
import {  handleInsertText, handleInsertTextFromURL, handleSearchText } from '../controllers/weaviateController';

const router = express.Router();

router.post('/ask', handleQuestion);

router.post('/search', handleSearchText)

// Sub-router for handling requests related to Weaviate service
router.post('/insert', handleInsertText);

router.post('/fromURL', handleInsertTextFromURL)

//router.delete('/clean', handleCleanDB)

router.post('/contextAsk', handleQuestionWithContext)

export default router;
