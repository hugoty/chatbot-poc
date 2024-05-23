import express from 'express';
import aiRouter from '../routes/aiRoutes';
import dbRouter from '../routes/dbRoutes';

const router = express.Router();

router.use('/ai', aiRouter);
router.use('/db', dbRouter);

export { router };
