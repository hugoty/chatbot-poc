// aiController.ts
import { Request, Response } from 'express';
import { AIService } from '../services/aiService';

const aiService = new AIService();

export async function handleQuestion(req: Request, res: Response): Promise<void> {
    try {
        const question = req.body.question;
        if (!question) {
            res.status(400).send({ error: 'No question provided' });
            return;
        }
        console.log("question :" + question);
        const answer = await aiService.invokeModel(question);
        console.log("answers : " + answer);
        res.status(200).send({ question, answer });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get an answer' });
    }
}

export async function handleQuestionWithContext(req: Request, res: Response): Promise<void> {
    try {
        const question = req.body.question;
        if (!question) {
            res.status(400).send({ error: 'No question provided' });
            return;
        }

        const answer = await aiService.askWithContext(question);
        res.status(200).send({ answer });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get an answer' });
    }
}

export async function handleClassifyRequest(req: Request, res: Response): Promise<void> {
    try {
        const question = req.body.request;
        if (!question) {
            res.status(400).send({ error: 'No request provided' });
            return;
        }

        const answer = await aiService.classifyRequest(question);
        res.status(200).send({ answer });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get an answer' });
    }
}

export async function handleDetectTask(req: Request, res: Response): Promise<void> {
    try {
        const question = req.body.question;
        if (!question) {
            res.status(400).send({ error: 'No request provided' });
            return ;
        }

        const { taskType, description } = await aiService.detectTaskTypeAndGenerateDescription(question);
        res.status(200).send({ taskType, description });
        return ; 
    } catch (error) {
        res.status(500).send({ error: 'Failed to get an answer' });
        throw error; 
    }
}

