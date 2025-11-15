import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { AuthRequest } from "../middlewares/authMiddleware";

const taskService = new TaskService();

export class TaskController {
  async create(req: AuthRequest, res: Response) {
    try {
      console.log("📥 POST /tasks - Create request:", {
        projectId: req.params.projectId,
        userId: req.userId,
        body: req.body,
      });

      const task = await taskService.createTask(
        req.params.projectId,
        req.userId!,
        {
          ...req.body,
          projectId: req.params.projectId,
        }
      );

      console.log("📤 Sending created task:", task);

      res.status(201).json({ status: "success", data: task });
    } catch (error: any) {
      console.error("❌ Create error:", error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getByProject(req: AuthRequest, res: Response) {
    try {
      const tasks = await taskService.getTasksByProject(
        req.params.projectId,
        req.userId!
      );
      res.json({ status: "success", data: tasks });
    } catch (error: any) {
      console.error("❌ Get by project error:", error.message);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.getTaskById(
        req.params.taskId,
        req.userId!
      );
      res.json({ status: "success", data: task });
    } catch (error: any) {
      console.error("❌ Get by ID error:", error.message);
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      console.log("📥 PUT/PATCH /tasks/:id - Update request:", {
        taskId: req.params.taskId,
        projectId: req.params.projectId,
        userId: req.userId,
        body: req.body,
      });

      const task = await taskService.updateTask(
        req.params.taskId,
        req.userId!,
        {
          ...req.body,
          projectId: req.params.projectId,
        }
      );

      console.log("📤 Sending updated task:", task);

      res.json({ status: "success", data: task });
    } catch (error: any) {
      console.error("❌ Update error:", error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      console.log("🗑️ DELETE /tasks/:id - Delete request:", {
        taskId: req.params.taskId,
        userId: req.userId,
      });

      await taskService.deleteTask(req.params.taskId, req.userId!);

      res.status(204).send();
    } catch (error: any) {
      console.error("❌ Delete error:", error.message);
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async moveToSection(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.moveTaskToSection(
        req.params.taskId,
        req.body.sectionId,
        req.userId!
      );
      res.json({ status: "success", data: task });
    } catch (error: any) {
      console.error("❌ Move to section error:", error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}
