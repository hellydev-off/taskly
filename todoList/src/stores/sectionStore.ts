import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  sectionsApi,
  type Section,
  type CreateSectionPayload,
  type UpdateSectionPayload,
} from "@/api";
import { useProjectStore } from "./projectStore";

export const useSectionStore = defineStore("sections", () => {
  const projectStore = useProjectStore();

  const sections = ref<Section[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const projectSections = computed<Section[]>(() =>
    sections.value.filter((s) => s.projectId === projectStore.currentProjectId)
  );

  async function createSection(
    projectId: string,
    payload: CreateSectionPayload
  ): Promise<Section> {
    try {
      const response = await sectionsApi.create(projectId, payload);

      const responseData = response.data || response;

      const newSection: Section = {
        id: responseData.id || "",
        name: responseData.name || payload.name || "",
        description: responseData.description || payload.description || "",
        projectId: projectId,
        tasks: responseData.tasks || [],
        createdAt: responseData.createdAt || new Date().toISOString(),
        updatedAt: responseData.updatedAt || new Date().toISOString(),
      } as Section;

      console.log("✅ New section created:", newSection);

      sections.value.push(newSection);
      return newSection;
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to create section";
      throw err;
    }
  }

  async function fetchSections(projectId: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await sectionsApi.getByProject(projectId);

      console.log("📡 Raw response:", response);

      const sectionsData = response.data?.data || response.data || [];

      console.log("📡 Sections data:", sectionsData);

      sections.value = (Array.isArray(sectionsData) ? sectionsData : []).map(
        (section: any) => ({
          id: section.id,
          name: section.name,
          color: section.color,
          order: section.order,
          projectId: projectId,
          tasks: section.tasks || [],
          createdAt: section.createdAt,
          updatedAt: section.updatedAt,
        })
      );

      console.log("✅ Final sections in store:", sections.value);
      console.log("✅ Project sections computed:", projectSections.value);
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to fetch sections";
    } finally {
      loading.value = false;
    }
  }

  async function updateSection(
    projectId: string,
    sectionId: string,
    payload: UpdateSectionPayload
  ): Promise<Section> {
    try {
      const response = await sectionsApi.update(projectId, sectionId, payload);

      const responseData = response.data || response;

      const index = sections.value.findIndex((s) => s.id === sectionId);
      if (index !== -1) {
        sections.value[index] = {
          ...sections.value[index],
          ...responseData,
          projectId: projectId,
          tasks: responseData.tasks || sections.value[index].tasks || [],
        };
      }

      return responseData;
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to update section";
      throw err;
    }
  }

  async function deleteSection(
    projectId: string,
    sectionId: string
  ): Promise<void> {
    try {
      await sectionsApi.delete(projectId, sectionId);
      sections.value = sections.value.filter((s) => s.id !== sectionId);
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to delete section";
      throw err;
    }
  }

  return {
    sections,
    loading,
    error,
    projectSections,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  };
});
