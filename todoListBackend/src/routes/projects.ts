import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { validateDto } from "../middlewares/validateDto";
import { CreateProjectDto } from "../dtos/CreateProjectDto";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ProjectController();

router.use(authMiddleware);

router.post("/projects", validateDto(CreateProjectDto), (req, res) =>
  controller.create(req, res)
);
router.get("/projects", (req, res) => controller.getAll(req, res));
router.get("/projects/:id", (req, res) => controller.getById(req, res));
router.put("/projects/:id", validateDto(CreateProjectDto), (req, res) =>
  controller.update(req, res)
);
router.delete("/projects/:id", (req, res) => controller.delete(req, res));

export default router;
