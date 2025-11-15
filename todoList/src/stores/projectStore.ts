import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  projectsApi,
  type Project,
  type CreateProjectPayload,
  type UpdateProjectPayload,
} from "@/api";

export const useProjectStore = defineStore("projects", () => {
  const projects = ref<Project[]>([]);
  const currentProjectId = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const allProjects = computed<Project[]>(() => projects.value);
  const currentProject = computed<Project | undefined>(() =>
    projects.value.find((p) => p.id === currentProjectId.value)
  );

  async function fetchProjects(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsApi.getAll();
      const data = response.data?.data || response.data;

      projects.value = Array.isArray(data) ? data : [];
      console.log("✅ Projects fetched:", projects.value);
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to fetch projects";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createProject(
    payload: CreateProjectPayload
  ): Promise<Project> {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsApi.create(payload);

      const responseData = response.data || response;

      const newProject: Project = {
        id: responseData.id || "",
        name: responseData.name || payload.name || "",
        description: responseData.description || payload.description || "",
        viewType: responseData.viewType || "list",
        color: responseData.color || "#e11d48",
        createdAt: responseData.createdAt || new Date().toISOString(),
        updatedAt: responseData.updatedAt || new Date().toISOString(),
      } as Project;

      console.log("✅ New project created:", newProject);

      projects.value.unshift(newProject);

      return newProject;
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to create project";
      console.error("❌ Create project error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(
    id: string,
    payload: UpdateProjectPayload
  ): Promise<Project> {
    try {
      const response = await projectsApi.update(id, payload);

      const responseData = response.data || response;

      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          ...responseData,
        };
      }

      console.log("✅ Project updated:", responseData);
      return responseData;
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to update project";
      throw err;
    }
  }

  async function deleteProject(id: string): Promise<void> {
    try {
      await projectsApi.delete(id);

      projects.value = projects.value.filter((p) => p.id !== id);

      if (currentProjectId.value === id) {
        currentProjectId.value = null;
      }

      console.log("✅ Project deleted");
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to delete project";
      throw err;
    }
  }

  function setCurrentProject(id: string): void {
    currentProjectId.value = id;
  }

  return {
    projects,
    currentProjectId,
    loading,
    error,
    allProjects,
    currentProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
  };
});
