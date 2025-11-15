<template>
  <div class="flex h-screen bg-gray-50">
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <ProjectsHeader
          :createProject="changeCreateModal"
          :onSearch="handleSearch"
        />
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          class="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-6 sm:py-8"
        >
          <div
            v-if="projectStore.loading"
            class="flex justify-center items-center py-12"
          >
            <div class="text-gray-500">
              <p class="mb-4">Загрузка проектов...</p>
              <div
                class="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto"
              ></div>
            </div>
          </div>

          <div
            v-else-if="projectStore.error"
            class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
          >
            <p class="font-semibold">Ошибка загрузки:</p>
            <p>{{ projectStore.error }}</p>
          </div>

          <div
            v-else-if="filteredProjects.length === 0"
            class="text-center py-12"
          >
            <NoData locale="projects" />
          </div>

          <ProjectsList
            v-else
            :projects="filteredProjects"
            :onSelect="selectProject"
            :onDelete="confirmDeleteOptions"
          />
        </div>
      </div>
    </div>

    <ProjectCreateModal
      :is-open="showCreateModal"
      :close="changeCreateModal"
      :onSubmit="handleCreateProject"
    />

    <WarningDelete
      :isOpen="confirmDelete"
      type="project"
      :itemName="selectedProject.name"
      :onConfirm="deleteProject"
      :onCancel="confirmDeleteOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useToast } from "@/composables/useToast";
import ProjectsHeader from "@/components/projects/ProjectsHeader.vue";
import ProjectsList from "@/components/projects/ProjectsList.vue";
import ProjectCreateModal from "@/components/ui/modals/CreateProject.vue";
import WarningDelete from "@/components/ui/modals/WarningModals/WarningDelete.vue";
import NoData from "@/components/ui/emptyStates/NoData.vue";

const router = useRouter();
const projectStore = useProjectStore();
const { show } = useToast();

const showCreateModal = ref(false);
const searchQuery = ref("");
const confirmDelete = ref(false);
const selectedProject = ref<any>({});

const filteredProjects = computed(() => {
  return projectStore.allProjects.filter((project: any) => {
    if (!project || !project.name) return false;
    const query = searchQuery.value.toLowerCase();
    return project.name.toLowerCase().includes(query);
  });
});

const handleSearch = (value: string) => {
  searchQuery.value = value.trim();
};

const selectProject = (projectId: string) => {
  projectStore.setCurrentProject(projectId);
  router.push(`/project/${projectId}`);
};

const handleCreateProject = async (projectData: any) => {
  try {
    await projectStore.createProject({
      name: projectData.name,
      description: projectData.description || "",
      viewType: projectData.viewType || "list",
      color: projectData.color || "#3B82F6",
    });
    show("success", "Проект создан!");
    changeCreateModal();
  } catch (error) {
    show("error", "Не удалось создать проект");
  }
};

const deleteProject = async () => {
  try {
    await projectStore.deleteProject(selectedProject.value.id);
    show("success", "Проект удален!");
    confirmDeleteOptions();
  } catch (error) {
    show("error", "Не удалось удалить проект");
  }
};

const changeCreateModal = () => {
  showCreateModal.value = !showCreateModal.value;
};

const confirmDeleteOptions = (project?: any) => {
  if (project) {
    selectedProject.value = project;
  }
  confirmDelete.value = !confirmDelete.value;
};

onMounted(async () => {
  try {
    await projectStore.fetchProjects();
  } catch {
    show("error", "Не удалось загрузить проекты");
  }
});
</script>
