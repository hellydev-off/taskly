import { AppDataSource } from "../config/database";
import { Project } from "../entities/Project";

export const ProjectRepository = AppDataSource.getRepository(Project).extend({
  async findAllWithRelations() {
    return this.find({
      relations: ["owner", "tasks", "sections"],
      order: { createdAt: "DESC" },
    });
  },

  async findByOwnerId(userId: string) {
    return this.find({
      where: { owner: { id: userId } },
      relations: ["owner", "tasks", "sections"],
      order: { createdAt: "DESC" },
    });
  },

  async findByIdWithRelations(id: string) {
    return this.findOne({
      where: { id },
      relations: ["owner", "tasks", "sections"],
    });
  },
});
