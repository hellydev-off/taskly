<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <div
        v-if="currentProject"
        class="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32"
      >
        <ProjectTasksHeader :project="currentProject" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <div class="text-center">
            <div
              class="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mb-4"
            ></div>
            <p class="text-gray-500">Загрузка...</p>
          </div>
        </div>

        <div v-else-if="error" class="p-6 text-center">
          <p class="text-red-600 font-medium">{{ error }}</p>
          <button
            @click="loadProjectData"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Повторить
          </button>
        </div>

        <div
          v-else-if="currentProject?.viewType === 'list'"
          class="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-6 sm:py-8"
        >
          <ProjectTasksFilter
            :searchQuery="searchQuery"
            :filterPriority="filterPriority"
            :selectedTags="selectedTags"
            :availableTags="availableTags"
            :onSearchChange="handleSearchChange"
            :onPriorityChange="handlePriorityChange"
            :onTagsChange="handleTagsChange"
          />

          <ProjectTasksList
            :tasks="filteredTasks"
            :projectName="currentProject.name"
            :onSelectTask="selectTask"
            :onToggleTaskStatus="toggleTaskStatus"
            :onDeleteTask="confirmDeleteOption"
            :onAddTask="handleAddTask"
            :onCancelAdd="() => {}"
            :onEdit="handleEditTask"
          />
        </div>

        <div
          v-else-if="currentProject?.viewType === 'board'"
          class="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-6 sm:py-8"
        >
          <ProjectTasksBoard
            :onDeleteTask="confirmDeleteOption"
            :onOpenAddTaskModal="openAddTaskModal"
          />
        </div>
      </div>

      <WarningDelete
        v-if="selectedTask"
        :isOpen="showConfirmDelete"
        type="task"
        :itemName="selectedTask.title || 'Задача'"
        :onConfirm="deleteTask"
        :onCancel="confirmDeleteOption"
      />

      <CreateTasksModal
        :is-open="showAddTaskModal"
        :default-section-id="selectedSectionId"
        @submit="handleAddTaskFromModal"
        @cancel="closeAddTaskModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";
import { useSectionStore } from "@/stores/sectionStore";
import { useToast } from "@/composables/useToast";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import ProjectTasksHeader from "@/components/projectTasks/ProjectTasksHeader.vue";
import ProjectTasksFilter from "@/components/projectTasks/ProjectTasksFilter.vue";
import ProjectTasksList from "@/components/projectTasks/ProjectTasksList.vue";
import ProjectTasksBoard from "@/components/projectTasks/ProjectTasksBoard.vue";
import WarningDelete from "@/components/ui/modals/WarningModals/WarningDelete.vue";
import CreateTasksModal from "@/components/ui/modals/CreateTasksModal.vue";

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const taskStore = useTaskStore();
const sectionStore = useSectionStore();
const { show } = useToast();

const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const filterPriority = ref("");
const selectedTags = ref<string[]>([]);
const selectedTask = ref<any>(null);
const showConfirmDelete = ref(false);
const showAddTaskModal = ref(false);
const selectedSectionId = ref<string | null>(null);

const currentProject = computed(() => projectStore.currentProject);

const tasks = computed(() => taskStore.tasks);
const projectTasks = computed(() => {
  console.log("🔍 tasks:", tasks.value);
  console.log("🔍 currentProject.id:", currentProject.value?.id);
  const filtered = tasks.value.filter(
    (t) => t.project?.id === currentProject.value?.id
  );
  console.log("✅ projectTasks:", filtered);
  return filtered;
});

const availableTags = computed(() => {
  const tags = new Set<string>();
  projectTasks.value.forEach((task: any) => {
    if (Array.isArray(task.tags)) {
      task.tags.forEach((tag: string) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});

const filteredTasks = computed(() => {
  let t = projectTasks.value;
  if (filterPriority.value)
    t = t.filter((x) => x.priority === filterPriority.value);
  if (selectedTags.value.length)
    t = t.filter(
      (x) => x.tags && x.tags.some((tag) => selectedTags.value.includes(tag))
    );
  if (searchQuery.value.trim())
    t = t.filter((x) =>
      x.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  return t;
});

const handleSearchChange = (value: string) => {
  searchQuery.value = value;
};

const handlePriorityChange = (value: string) => {
  filterPriority.value = value;
};

const handleTagsChange = (tags: string[]) => {
  selectedTags.value = tags;
};

const selectTask = (taskId: string) => {
  console.log("Selected task:", taskId);
};

const handleAddTask = async (taskData: any) => {
  try {
    console.log("📤 Sending task data:", taskData);

    const sectionId = sectionStore.projectSections?.[0]?.id || null;

    const response = await taskStore.createTask(currentProject.value.id, {
      title: taskData.title || "",
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      sectionId,
    });

    console.log("📥 Server response:", response);

    show("success", "Задача добавлена!");
  } catch (error: any) {
    console.error("Error adding task:", error);
    show("error", "Не удалось добавить задачу");
  }
};

const handleAddTaskFromModal = async (taskData: any) => {
  try {
    if (!currentProject.value?.id) {
      show("error", "Проект не найден");
      return;
    }

    await taskStore.createTask(currentProject.value.id, {
      title: taskData.title || "",
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      sectionId: selectedSectionId.value || null,
    });

    show("success", "Задача добавлена!");
    closeAddTaskModal();
  } catch (error: any) {
    console.error("Error adding task from modal:", error);
    show(
      "error",
      error?.response?.data?.message || "Не удалось добавить задачу"
    );
  }
};

const toggleTaskStatus = async (taskId: string) => {
  try {
    if (!currentProject.value?.id || !taskId) return;

    const task = projectTasks.value.find((t: any) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "завершено" ? "в_процессе" : "завершено";

    await taskStore.updateTask(currentProject.value.id, taskId, {
      title: task.title,
      status: newStatus,
    });

    show("success", `Статус: ${newStatus}`);
  } catch (error: any) {
    console.error("Error toggling task status:", error);
    show("error", "Не удалось обновить статус");
  }
};

const handleEditTask = async (updatedTask: any) => {
  try {
    if (!currentProject.value?.id || !updatedTask?.id) return;

    await taskStore.updateTask(currentProject.value.id, updatedTask.id, {
      title: updatedTask.title || "",
      description: updatedTask.description || "",
      priority: updatedTask.priority || "medium",
      status: updatedTask.status || "в_процессе",
      dueDate: updatedTask.dueDate || null,
      tags: updatedTask.tags || [],
    });

    show("success", "Задача обновлена!");
  } catch (error: any) {
    console.error("Error editing task:", error);
    show(
      "error",
      error?.response?.data?.message || "Не удалось обновить задачу"
    );
  }
};

const confirmDeleteOption = (task?: any) => {
  if (task) {
    selectedTask.value = task;
  }
  showConfirmDelete.value = !showConfirmDelete.value;
};

const deleteTask = async () => {
  try {
    if (!currentProject.value?.id || !selectedTask.value?.id) {
      console.error("Missing projectId or taskId");
      show("error", "Проект или задача не найдены");
      confirmDeleteOption(null);
      return;
    }

    console.log("🗑️ Deleting task:", {
      projectId: currentProject.value.id,
      taskId: selectedTask.value.id,
    });

    await taskStore.deleteTask(currentProject.value.id, selectedTask.value.id);

    show("success", "Задача удалена!");
    confirmDeleteOption(null);
  } catch (error: any) {
    console.error("Error deleting task:", error);
    show(
      "error",
      error?.response?.data?.message || "Не удалось удалить задачу"
    );
  }
};

const openAddTaskModal = (sectionId: string | null = null) => {
  selectedSectionId.value = sectionId;
  showAddTaskModal.value = true;
};

const closeAddTaskModal = () => {
  showAddTaskModal.value = false;
  selectedSectionId.value = null;
};

const loadProjectData = async () => {
  const projectId = route.params.projectId as string;

  if (!projectId) {
    error.value = "Проект не найден";
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    projectStore.setCurrentProject(projectId);

    if (!currentProject.value) {
      error.value = "Проект не найден";
      await router.push("/projects");
      return;
    }

    if (currentProject.value.viewType === "list") {
      await taskStore.fetchTasks(projectId);
    } else if (currentProject.value.viewType === "board") {
      await sectionStore.fetchSections(projectId);
    }
  } catch (err: any) {
    console.error("Error loading project:", err);
    error.value = "Ошибка при загрузке проекта";
    show("error", error.value);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProjectData();
});

watch(
  () => route.params.projectId,
  async (newProjectId, oldProjectId) => {
    if (newProjectId && newProjectId !== oldProjectId) {
      searchQuery.value = "";
      filterPriority.value = "";
      selectedTags.value = [];
      selectedTask.value = null;
      await loadProjectData();
    }
  }
);
</script>
