import { Router } from "express";
import agentController from "../controllers/agentController";

const router = Router();

router.post("/agent", (req, res) => agentController.handleRequest(req, res));

export default router;
