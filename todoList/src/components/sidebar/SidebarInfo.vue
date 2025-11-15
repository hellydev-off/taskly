<template>
  <nav>
    <ul class="space-y-0.5">
      <li
        class="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-hover-gray cursor-pointer select-none group"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 0C5.15046 0.0224416 3.38299 0.767145 2.07507 2.07507C0.767145 3.38299 0.0224416 5.15046 0 7C0.0224416 8.84954 0.767145 10.617 2.07507 11.9249C3.38299 13.2329 5.15046 13.9776 7 14C8.84954 13.9776 10.617 13.2329 11.9249 11.9249C13.2329 10.617 13.9776 8.84954 14 7C13.9776 5.15046 13.2329 3.38299 11.9249 2.07507C10.617 0.767145 8.84954 0.0224416 7 0ZM11 7.5H7.5V11H6.5V7.5H3V6.5H6.5V3H7.5V6.5H11V7.5Z"
            fill="#E44332"
          />
        </svg>
        <button
          @click="openCreateTask"
          class="text-todoist-red font-medium text-sm focus:outline-none flex-1 text-left group-hover:underline"
        >
          Создать задачу
        </button>
      </li>
    </ul>

    <CreateTasksModal
      :isOpen="isCreateTaskOpen"
      locale="Global"
      :availableProjects="projects"
      @close="handleCloseModal"
      @submit="handleSubmitTask"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";
import { useToast } from "@/composables/useToast";
import CreateTasksModal from "@/components/ui/modals/CreateTasksModal.vue";
import type { Project } from "@/api";

interface TaskData {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string | null;
  tags?: string[];
  projectId: string;
}

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const { show } = useToast();

const isCreateTaskOpen = ref<boolean>(false);

const projects = computed<Project[]>(() => projectStore.allProjects);

const openCreateTask = (): void => {
  isCreateTaskOpen.value = true;
};

const handleCloseModal = (): void => {
  isCreateTaskOpen.value = false;
};

const handleSubmitTask = async (taskData: TaskData): Promise<void> => {
  try {
    const projectId = taskData.projectId;

    if (!projectId) {
      show("error", "Выберите проект");
      return;
    }

    await taskStore.createTask(projectId, {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
    });

    show("success", "Задача добавлена!");
    isCreateTaskOpen.value = false;
  } catch (error) {
    show(
      "error",
      (error as any).response?.data?.message || "Не удалось добавить задачу"
    );
  }
};
</script>
