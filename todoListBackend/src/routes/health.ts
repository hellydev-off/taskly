import { Router } from "express";
import { HealthController } from "../controllers/HealthController";

const router = Router();
const controller = new HealthController();

router.get("/health", (req, res) => controller.health(req, res));

router.get("/health/ping", (req, res) => controller.ping(req, res));

export default router;
