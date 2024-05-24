// jiraRoutes.ts
import express from 'express';
import {handlecreateJiraIssue ,handlelistJiraTickets, handlegetJiraProjects } from '../controllers/jiraController';

const jiraRouter = express.Router();

// Route to create a new Jira issue

jiraRouter.post('/GetJiraProjects',handlegetJiraProjects);
jiraRouter.post('/ListTickets',handlelistJiraTickets);
jiraRouter.post('/CreateJiraTicket', handlecreateJiraIssue);
export default jiraRouter;