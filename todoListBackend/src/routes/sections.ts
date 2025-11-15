import { Router } from "express";
import { SectionController } from "../controllers/SectionController";
import { validateDto } from "../middlewares/validateDto";
import { CreateSectionDto } from "../dtos/CreateSectionDto";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new SectionController();

router.use(authMiddleware);

router.post(
  "/projects/:projectId/sections",
  validateDto(CreateSectionDto),
  (req, res) => controller.create(req, res)
);
router.get("/projects/:projectId/sections", (req, res) =>
  controller.getByProject(req, res)
);
router.put(
  "/projects/:projectId/sections/:sectionId",
  validateDto(CreateSectionDto),
  (req, res) => controller.update(req, res)
);
router.delete("/projects/:projectId/sections/:sectionId", (req, res) =>
  controller.delete(req, res)
);

export default router;
