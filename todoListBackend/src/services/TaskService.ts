import { TaskRepository } from "../repositories/TaskRepository";
import { CreateTaskDto } from "../dtos/CreateTaskDto";

export class TaskService {
  async createTask(projectId: string, userId: string, data: CreateTaskDto) {
    console.log("📝 Creating task with data:", { projectId, userId, data });

    const task = TaskRepository.create({
      ...data,
      project: { id: projectId },
      user: { id: userId },
      section: data.sectionId ? { id: data.sectionId } : null,
      tags: data.tags || [],
    });

    console.log("📊 Task to save:", task);
    const saved = await TaskRepository.save(task);
    console.log("✅ Task created:", saved);

    return saved;
  }

  async getTasksByProject(projectId: string, userId: string) {
    const tasks = await TaskRepository.findByProjectId(projectId, userId);
    console.log(`📋 Found ${tasks.length} tasks for project ${projectId}`);
    return tasks;
  }

  async getTaskById(id: string, userId: string) {
    const task = await TaskRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["project", "section", "user"],
    });

    if (!task) {
      throw new Error(`Task not found or access denied: ${id}`);
    }

    console.log("📖 Task found:", task);
    return task;
  }

  async updateTask(id: string, userId: string, data: Partial<CreateTaskDto>) {
    console.log("🔄 Updating task:", { id, userId, data });

    const task = await TaskRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) {
      throw new Error(`Task not found or access denied: ${id}`);
    }

    if (data.status === "завершено" && !task.completedAt) {
      task.completedAt = new Date();
      console.log("✅ Task marked as completed");
    }

    Object.assign(task, {
      title: data.title ?? task.title,
      description: data.description ?? task.description,
      priority: data.priority ?? task.priority,
      status: data.status ?? task.status,
      dueDate: data.dueDate !== undefined ? data.dueDate : task.dueDate,
      tags: data.tags ?? task.tags,
    });

    console.log("📝 Task after update:", task);

    const updated = await TaskRepository.save(task);

    console.log("✅ Task updated successfully:", updated);

    return updated;
  }

  async deleteTask(id: string, userId: string) {
    console.log("🗑️ Deleting task:", { id, userId });

    const task = await TaskRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) {
      throw new Error(`Task not found or access denied: ${id}`);
    }

    const result = await TaskRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`Task not found: ${id}`);
    }

    console.log("✅ Task deleted");
  }

  async moveTaskToSection(taskId: string, sectionId: string, userId: string) {
    console.log("📍 Moving task to section:", { taskId, sectionId, userId });

    const task = await TaskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) {
      throw new Error(`Task not found or access denied: ${taskId}`);
    }

    task.section = { id: sectionId } as any;

    const updated = await TaskRepository.save(task);

    console.log("✅ Task moved to section");

    return updated;
  }
}
