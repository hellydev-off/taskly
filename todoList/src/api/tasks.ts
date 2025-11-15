import http from "./http";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "в_процессе" | "завершено";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  sectionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: "в_процессе" | "завершено";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  sectionId?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: "в_процессе" | "завершено";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  sectionId?: string;
}

export interface MoveSectionPayload {
  sectionId: string;
}

export const tasksApi = {
  async getByProject(projectId: string): Promise<{ data: Task[] }> {
    const response = await http.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  async getById(projectId: string, taskId: string): Promise<Task> {
    const response = await http.get(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  async create(projectId: string, payload: CreateTaskPayload): Promise<Task> {
    const response = await http.post(`/projects/${projectId}/tasks`, payload);
    return response.data;
  },

  async update(
    projectId: string,
    taskId: string,
    payload: UpdateTaskPayload
  ): Promise<Task> {
    const response = await http.put(
      `/projects/${projectId}/tasks/${taskId}`,
      payload
    );
    return response.data;
  },

  async delete(projectId: string, taskId: string): Promise<void> {
    await http.delete(`/projects/${projectId}/tasks/${taskId}`);
  },

  async moveToSection(
    projectId: string,
    taskId: string,
    sectionId: string
  ): Promise<Task> {
    const response = await http.patch(
      `/projects/${projectId}/tasks/${taskId}/section`,
      { sectionId }
    );
    return response.data;
  },
};
