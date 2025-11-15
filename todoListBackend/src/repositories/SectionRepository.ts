import { AppDataSource } from "../config/database";
import { Section } from "../entities/Section";

export const SectionRepository = AppDataSource.getRepository(Section).extend({
  async findByProjectId(projectId: string) {
    return this.find({
      where: { project: { id: projectId } },
      relations: ["tasks"],
      order: { order: "ASC" },
    });
  },
});
