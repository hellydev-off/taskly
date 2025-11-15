import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";

export const TaskRepository = AppDataSource.getRepository(Task).extend({
  async findByProjectId(projectId: string, userId: string) {
    return this.find({
      where: {
        project: { id: projectId },
        user: { id: userId },
      },
      relations: ["project", "section", "user"],
      order: { createdAt: "DESC" },
    });
  },

  async findByUserId(userId: string) {
    return this.find({
      where: { user: { id: userId } },
      relations: ["project", "section", "user"],
      order: { createdAt: "DESC" },
    });
  },

  async findBySectionId(sectionId: string, userId: string) {
    return this.find({
      where: {
        section: { id: sectionId },
        user: { id: userId },
      },
      order: { createdAt: "DESC" },
    });
  },
});
