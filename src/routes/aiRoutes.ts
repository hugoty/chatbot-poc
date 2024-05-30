// aiRoutes.ts
import express from 'express';
import { handleClassifyRequest, handleDetectTask, handleQuestion, handleQuestionWithContext } from '../controllers/aiController';

const aiRouter = express.Router();

aiRouter.post('/ask', handleQuestion);
aiRouter.post('/contextAsk', handleQuestionWithContext);
aiRouter.post('/RequestClassification', handleClassifyRequest);
aiRouter.post('/DetectTask', handleDetectTask); 
export default aiRouter;
