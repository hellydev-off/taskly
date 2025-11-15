import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { validateDto } from "../middlewares/validateDto";
import { CreateTaskDto } from "../dtos/CreateTaskDto";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new TaskController();

router.use(authMiddleware);

router.post(
  "/projects/:projectId/tasks",
  validateDto(CreateTaskDto),
  (req, res) => controller.create(req, res)
);

router.get("/projects/:projectId/tasks", (req, res) =>
  controller.getByProject(req, res)
);

router.get("/projects/:projectId/tasks/:taskId", (req, res) =>
  controller.getById(req, res)
);

router.put(
  "/projects/:projectId/tasks/:taskId",
  validateDto(CreateTaskDto),
  (req, res) => controller.update(req, res)
);

router.patch(
  "/projects/:projectId/tasks/:taskId",
  validateDto(CreateTaskDto),
  (req, res) => controller.update(req, res)
);

router.delete("/projects/:projectId/tasks/:taskId", (req, res) =>
  controller.delete(req, res)
);

router.patch("/projects/:projectId/tasks/:taskId/section", (req, res) =>
  controller.moveToSection(req, res)
);

export default router;
