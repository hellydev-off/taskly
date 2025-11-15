<template>
  <div v-if="currentProject" class="space-y-4">
    <div v-if="currentProject.viewType === 'board'" class="space-y-4">
      <div class="overflow-x-auto pb-4">
        <div class="flex gap-4" style="min-width: min-content">
          <BoardColumn
            v-for="section in projectSections"
            :key="section.id"
            :section="section"
            :tasks="tasksBySection(section.id)"
            :onDeleteTask="onDeleteTask"
            :onToggleTaskStatus="onToggleTaskStatus"
            :onDeleteSection="deleteSection"
            :onOpenAddTaskModal="onOpenAddTaskModal"
            :onDropTask="handleTaskDrop"
          />

          <div v-if="projectSections.length < 4" class="flex-shrink-0 w-80">
            <div
              v-if="!showAddSectionForm"
              @click="showAddSectionForm = true"
              class="border-2 border-dashed border-gray-300 rounded-lg p-4 h-full flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer"
            >
              <svg
                class="w-6 h-6 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p class="text-gray-600 font-medium text-sm">Добавить отдел</p>
            </div>

            <div
              v-else
              class="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3 h-full flex flex-col justify-center"
            >
              <div>
                <label class="text-xs font-semibold text-gray-900 block mb-2">
                  Название отдела
                </label>
                <input
                  v-model="newSectionName"
                  type="text"
                  placeholder="Например: Новый отдел"
                  autofocus
                  @keydown.enter="createSection"
                  @keydown.escape="cancelAddSection"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red"
                />
              </div>
              <div class="flex gap-2">
                <button
                  @click="cancelAddSection"
                  class="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition text-sm"
                >
                  Отмена
                </button>
                <button
                  @click="createSection"
                  :disabled="!newSectionName.trim()"
                  class="flex-1 px-3 py-2 bg-todoist-red hover:bg-todoist-red-light1 text-white font-medium rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";
import { useSectionStore } from "@/stores/sectionStore";
import { useToast } from "@/composables/useToast";
import BoardColumn from "./BoardColumn.vue";
import type { Project, Task } from "@/api";

interface TaskDropData {
  taskId: string;
  fromSectionId: string;
  toSectionId: string;
}

interface Props {
  onDeleteTask?: (task: Task) => void;
  onOpenAddTaskModal?: (sectionId: string) => void;
}

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const sectionStore = useSectionStore();
const { show } = useToast();

const props = defineProps<Props>();

const showAddSectionForm = ref<boolean>(false);
const newSectionName = ref<string>("");

const currentProject = computed<Project | undefined>(
  () => projectStore.currentProject
);
const projectSections = computed(() => sectionStore.projectSections);

const tasksBySection = (sectionId: string): Task[] => {
  console.log("🔍 Looking for section:", sectionId);
  console.log("🔍 All sections:", sectionStore.projectSections);

  const section = sectionStore.projectSections.find((s) => s.id === sectionId);

  console.log("🔍 Found section:", section);
  console.log("🔍 Tasks in section:", section?.tasks);

  return section?.tasks || [];
};

const createSection = async (): Promise<void> => {
  if (!newSectionName.value.trim()) return;

  if (projectSections.value.length >= 4) {
    show("error", "Максимум 4 отдела!");
    return;
  }

  try {
    if (currentProject.value) {
      await sectionStore.createSection(currentProject.value.id, {
        name: newSectionName.value,
        order: projectSections.value.length,
      });
      show("success", "Отдел создан!");
      newSectionName.value = "";
      showAddSectionForm.value = false;
    }
  } catch (error) {
    show("error", "Не удалось создать отдел");
    throw error;
  }
};

const cancelAddSection = (): void => {
  newSectionName.value = "";
  showAddSectionForm.value = false;
};

const deleteSection = async (sectionId: string): Promise<void> => {
  if (!confirm("Удалить отдел?")) return;

  try {
    if (currentProject.value) {
      await sectionStore.deleteSection(currentProject.value.id, sectionId);
      show("success", "Отдел удален!");
    }
  } catch (error) {
    show("error", "Не удалось удалить отдел");
    throw error;
  }
};

const handleTaskDrop = async (dropData: TaskDropData): Promise<void> => {
  const { taskId, fromSectionId, toSectionId } = dropData;

  if (fromSectionId === toSectionId) return;

  try {
    if (currentProject.value) {
      await taskStore.moveTaskToSection(
        currentProject.value.id,
        taskId,
        toSectionId
      );
      show("success", "Задача перемещена!");
    }
  } catch (error) {
    show("error", "Не удалось переместить задачу");
    throw error;
  }
};

const onDeleteTask = (task: Task): void => {
  props.onDeleteTask?.(task);
};

const onToggleTaskStatus = async (taskId: string): Promise<void> => {
  let task: Task | undefined;
  for (const section of sectionStore.projectSections) {
    task = section.tasks?.find((t) => t.id === taskId);
    if (task) break;
  }

  if (task && currentProject.value) {
    const newStatus = task.status === "завершено" ? "в_процессе" : "завершено";

    try {
      await taskStore.updateTask(currentProject.value.id, taskId, {
        status: newStatus,
      });
      show("success", `Статус: ${newStatus}`);
    } catch (error) {
      show("error", "Не удалось обновить статус");
      throw error;
    }
  }
};

const onOpenAddTaskModal = (sectionId: string): void => {
  props.onOpenAddTaskModal?.(sectionId);
};
</script>
