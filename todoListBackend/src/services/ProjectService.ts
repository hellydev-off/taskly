import { ProjectRepository } from "../repositories/ProjectRepository";
import { CreateProjectDto } from "../dtos/CreateProjectDto";

export class ProjectService {
  async createProject(data: CreateProjectDto, userId: string) {
    console.log("📝 Creating project:", { userId, data });

    const project = ProjectRepository.create({
      ...data,
      owner: { id: userId },
    });

    console.log("📊 Project to save:", project);
    const saved = await ProjectRepository.save(project);
    console.log("✅ Project created:", saved);

    return saved;
  }

  async getAllProjects(userId: string) {
    console.log("📋 Getting all projects for user:", userId);

    const projects = await ProjectRepository.findByOwnerId(userId);
    console.log(`📊 Found ${projects.length} projects`);

    return projects;
  }

  async getProjectById(id: string, userId: string) {
    console.log("📖 Getting project:", { id, userId });

    const project = await ProjectRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ["owner", "tasks", "sections"],
    });

    if (!project) {
      throw new Error("Project not found or access denied");
    }

    console.log("✅ Project found:", project);
    return project;
  }

  async updateProject(
    id: string,
    data: Partial<CreateProjectDto>,
    userId: string
  ) {
    console.log("🔄 Updating project:", { id, userId, data });

    const project = await ProjectRepository.findOne({
      where: { id, owner: { id: userId } },
    });

    if (!project) {
      throw new Error("Project not found or access denied");
    }

    Object.assign(project, data);
    console.log("📝 Project after update:", project);

    const updated = await ProjectRepository.save(project);
    console.log("✅ Project updated:", updated);

    return updated;
  }

  async deleteProject(id: string, userId: string) {
    console.log("🗑️ Deleting project:", { id, userId });

    const project = await ProjectRepository.findOne({
      where: { id, owner: { id: userId } },
    });

    if (!project) {
      throw new Error("Project not found or access denied");
    }

    const result = await ProjectRepository.delete(id);

    if (result.affected === 0) {
      throw new Error("Project not found");
    }

    console.log("✅ Project deleted");
  }
}
