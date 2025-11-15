import http from "./http";

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  viewType: "list" | "board";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  color: string;
  viewType: "list" | "board";
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  color?: string;
  viewType?: "list" | "board";
}

export const projectsApi = {
  async getAll(): Promise<{ data: Project[] }> {
    const response = await http.get("/projects");
    return response.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await http.get(`/projects/${id}`);
    return response.data;
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    const response = await http.post("/projects", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const response = await http.put(`/projects/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/projects/${id}`);
  },
};
