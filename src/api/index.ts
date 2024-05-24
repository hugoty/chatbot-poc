import express from 'express';
import aiRouter from '../routes/aiRoutes';
import dbRouter from '../routes/dbRoutes';
import jiraRouter from '../routes/jiraRoutes';

const router = express.Router();

router.use('/ai', aiRouter);
router.use('/db', dbRouter);
router.use('/jira', jiraRouter);

export { router };
