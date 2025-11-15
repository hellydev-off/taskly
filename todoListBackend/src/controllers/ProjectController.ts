import { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";
import { AuthRequest } from "../middlewares/authMiddleware"; // ✅ ИСПОЛЬЗУЙ ПРАВИЛЬНЫЙ ТИП

const projectService = new ProjectService();

export class ProjectController {
  // ✅ CREATE - ПЕРЕДАЙ userId
  async create(req: AuthRequest, res: Response) {
    try {
      console.log("📥 POST /projects - Create request:", {
        userId: req.userId, // ✅ ИЗ MIDDLEWARE
        body: req.body,
      });

      const project = await projectService.createProject(req.body, req.userId!); // ✅ ПЕРЕДАЙ userId
      res.status(201).json({ status: "success", data: project });
    } catch (error: any) {
      console.error("❌ Create error:", error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  // ✅ GET ALL - ТОЛЬКО СВОИ ПРОЕКТЫ
  async getAll(req: AuthRequest, res: Response) {
    try {
      const projects = await projectService.getAllProjects(req.userId!); // ✅ ПЕРЕДАЙ userId
      res.json({ status: "success", data: projects });
    } catch (error: any) {
      console.error("❌ Get all error:", error.message);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // ✅ GET BY ID - ПРОВЕРЬ ВЛАДЕЛЬЦА
  async getById(req: AuthRequest, res: Response) {
    try {
      const project = await projectService.getProjectById(
        req.params.id,
        req.userId! // ✅ ПЕРЕДАЙ userId
      );
      res.json({ status: "success", data: project });
    } catch (error: any) {
      console.error("❌ Get by ID error:", error.message);
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  // ✅ UPDATE - ПРОВЕРЬ ВЛАДЕЛЬЦА
  async update(req: AuthRequest, res: Response) {
    try {
      const project = await projectService.updateProject(
        req.params.id,
        req.body,
        req.userId!
      );
      res.json({ status: "success", data: project });
    } catch (error: any) {
      console.error("❌ Update error:", error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await projectService.deleteProject(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      console.error("❌ Delete error:", error.message);
      res.status(404).json({ status: "error", message: error.message });
    }
  }
}
