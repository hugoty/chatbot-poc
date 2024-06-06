import { Request, Response } from "express";
import agentService from "../services/agentService";
import { BaseMessage } from "@langchain/core/messages";

class AgentController {
  private chatHistory: BaseMessage[] = [];

  public async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body.input;
      const output = await agentService.execute(input, this.chatHistory);
      res.status(200).send({ result: output });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}

export default new AgentController();
