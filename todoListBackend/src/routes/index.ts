import { Router } from "express";
import projectRoutes from "./projects";
import taskRoutes from "./tasks";
import sectionRoutes from "./sections";

const router = Router();

router.use(projectRoutes);
router.use(taskRoutes);
router.use(sectionRoutes);

export default router;
