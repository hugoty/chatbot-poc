import { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { JiraService } from '../services/jiraService';
import axios from 'axios';
 
export async function handleGetJiraProjects(req: Request, res: Response): Promise<void> {
    const { jiraUrl, email, apiToken } = req.body;
 
    if (!jiraUrl || !email || !apiToken) {
        res.status(400).send({ error: 'Missing required parameters' });
        return;
    }
 
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
 
    try {
        const response = await axios.get(
            `${jiraUrl}/rest/api/3/project`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const answer = response.data;
        console.log('Jira projects:', answer);
        res.status(200).send({ answer });
    } catch (error) {
        console.error('Error fetching Jira projects:', error);
        res.status(500).send({ error: 'Failed to fetch Jira projects' });
    }
}
export async function handleListJiraEpics(req: Request, res: Response): Promise<void> {
    const { jiraUrl, email, apiToken, projectKey } = req.body;
 
    if (!jiraUrl || !email || !apiToken || !projectKey) {
        res.status(400).send({ error: 'Missing required parameters' });
        return;
    }
 
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
 
    try {
        const response = await axios.get(
            `${jiraUrl}/rest/api/3/search`,
            {
                params: {
                    jql: `issuetype="Epic"`
                },
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );
 
        const tickets = response.data.issues;
        res.status(200).send({ tickets });
    } catch (error) {
        console.error('Error fetching Jira tickets:', error);
        res.status(500).send({ error: 'Failed to fetch tickets' });
    }
}


export async function handleListJiraTickets(req: Request, res: Response): Promise<void> {
    const { jiraUrl, email, apiToken, projectKey } = req.body;
 
    if (!jiraUrl || !email || !apiToken || !projectKey) {
        res.status(400).send({ error: 'Missing required parameters' });
        return;
    }
 
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
 
    try {
        const response = await axios.get(
            `${jiraUrl}/rest/api/3/search`,
            {
                params: {
                    jql: `project = ${projectKey}`
                },
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );
 
        const tickets = response.data.issues;
        res.status(200).send({ tickets });
    } catch (error) {
        console.error('Error fetching Jira tickets:', error);
        res.status(500).send({ error: 'Failed to fetch tickets' });
    }
}
 
 
export async function handleCreateJiraIssue(req: Request, res: Response): Promise<void> {
    const { jiraUrl, email, apiToken, projectKey, input } = req.body;
 
    if (!jiraUrl || !email || !apiToken || !projectKey || !input) {
        res.status(400).send({ error: 'Missing required parameters' });
        return;
    }
 
    try {
        // Initialize AIService instance
        const aiService = new AIService();
 
        // Detect task type and generate description
        const { taskType, description, name , epic } = await aiService.detectTaskTypeAndGenerateDescription(input);
        console.log('Detected task:', taskType);
        console.log('Description:', description);
 
        // Initialize JiraService instance
        const jiraService = new JiraService(email, apiToken, jiraUrl);
 
        // Create the Jira issue
        const answer = await jiraService.createJiraIssue(projectKey, taskType, description, name , epic);
        console.log('Jira ticket:', answer);
        res.status(200).send({ answer });
    } catch (error) {
        console.error('Failed to create issue:', error);
        res.status(500).send({ error: 'Failed to create issue' });
    }
}
 
