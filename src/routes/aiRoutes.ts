// aiRoutes.ts
import express from 'express';
import { handleQuestion, handleQuestionWithContext } from '../controllers/aiController';

const aiRouter = express.Router();

aiRouter.post('/ask', handleQuestion);
aiRouter.post('/contextAsk', handleQuestionWithContext);

export default aiRouter;
