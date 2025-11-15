import { Request, Response } from "express";

export class HealthController {
  health(req: Request, res: Response) {
    res.json({
      status: "✅ OK",
      message: "Server is running!",
      timestamp: new Date().toISOString(),
    });
  }

  ping(req: Request, res: Response) {
    res.json({
      status: "pong",
      serverTime: new Date().toISOString(),
    });
  }
}
