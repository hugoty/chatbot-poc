// anthropicController.ts
import { Request, Response } from 'express';
import { AnthropicsService } from '../services/anthropicService';

const anthropicsService = new AnthropicsService();

export async function handleQuestion(req: Request, res: Response): Promise<void> {
    try {
        const question = req.body.question;
        if (!question) {
            res.status(400).send({ error: 'No question provided' });
            return;
        }

        const answer = await anthropicsService.invokeModel(question);
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

        const answer = await anthropicsService.askWithContext(question);
        res.status(200).send({ question, answer });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get an answer' });
    }
}
