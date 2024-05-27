// jiraRoutes.ts
import express from 'express';
import {handleCreateJiraIssue ,handleListJiraTickets, handlegetJiraProjects, handleListJiraEpics } from '../controllers/jiraController';

const jiraRouter = express.Router();

// Route to create a new Jira issue

jiraRouter.post('/GetJiraProjects',handlegetJiraProjects);
jiraRouter.get('/ListTickets',handleListJiraTickets);
jiraRouter.get('/ListEpics',handleListJiraEpics);
jiraRouter.post('/CreateJiraTicket', handleCreateJiraIssue);
export default jiraRouter;