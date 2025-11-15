import http from "./http";

export interface Section {
  id: string;
  projectId: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionPayload {
  name: string;
  order?: number;
}

export interface UpdateSectionPayload {
  name?: string;
  order?: number;
}

export const sectionsApi = {
  async getByProject(projectId: string): Promise<{ data: Section[] }> {
    const response = await http.get(`/projects/${projectId}/sections`);
    return response.data;
  },

  async create(
    projectId: string,
    payload: CreateSectionPayload
  ): Promise<Section> {
    const response = await http.post(
      `/projects/${projectId}/sections`,
      payload
    );
    return response.data;
  },

  async update(
    projectId: string,
    sectionId: string,
    payload: UpdateSectionPayload
  ): Promise<Section> {
    const response = await http.put(
      `/projects/${projectId}/sections/${sectionId}`,
      payload
    );
    return response.data;
  },

  async delete(projectId: string, sectionId: string): Promise<void> {
    await http.delete(`/projects/${projectId}/sections/${sectionId}`);
  },
};
