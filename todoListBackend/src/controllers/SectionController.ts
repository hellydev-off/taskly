import { Request, Response } from "express";
import { SectionService } from "../services/SectionService";

const sectionService = new SectionService();

export class SectionController {
  async create(req: Request, res: Response) {
    try {
      const section = await sectionService.createSection(
        req.params.projectId,
        req.body
      );
      res.status(201).json({ status: "success", data: section });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getByProject(req: Request, res: Response) {
    try {
      const sections = await sectionService.getSectionsByProject(
        req.params.projectId
      );
      res.json({ status: "success", data: sections });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const section = await sectionService.updateSection(
        req.params.sectionId,
        req.body
      );
      res.json({ status: "success", data: section });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await sectionService.deleteSection(req.params.sectionId);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }
}
