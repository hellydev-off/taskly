import { SectionRepository } from "../repositories/SectionRepository";
import { CreateSectionDto } from "../dtos/CreateSectionDto";

export class SectionService {
  async createSection(projectId: string, data: CreateSectionDto) {
    const section = SectionRepository.create({
      ...data,
      project: { id: projectId },
    });
    return SectionRepository.save(section);
  }

  async getSectionsByProject(projectId: string) {
    return SectionRepository.findByProjectId(projectId);
  }

  async updateSection(id: string, data: Partial<CreateSectionDto>) {
    const section = await SectionRepository.findOne({ where: { id } });
    if (!section) throw new Error("Section not found");
    Object.assign(section, data);
    return SectionRepository.save(section);
  }

  async deleteSection(id: string) {
    const result = await SectionRepository.delete(id);
    if (result.affected === 0) throw new Error("Section not found");
  }
}
