<template>
  <div
    v-if="props.section"
    class="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 p-4 space-y-3 flex flex-col"
  >
    <div class="flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-3 h-3 rounded-full flex-shrink-0"
          :style="{ backgroundColor: props.section.color }"
        ></div>
        <h3 class="font-semibold text-gray-900 truncate">
          {{ props.section.name }}
        </h3>
        <span
          class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex-shrink-0"
        >
          {{ props.tasks?.length || 0 }}
        </span>
      </div>
      <button
        @click="deleteSection"
        class="text-gray-400 hover:text-red-600 text-sm flex-shrink-0 ml-2"
      >
        ✕
      </button>
    </div>

    <div
      class="flex-1 overflow-y-auto space-y-2 min-h-0 p-2 rounded-lg transition"
      :class="[isDragOver ? 'bg-blue-50 border-2 border-blue-300' : '']"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <div
        v-if="!props.tasks || props.tasks.length === 0"
        class="text-center text-gray-400 text-sm py-4"
      >
        Нет задач
      </div>

      <div
        v-for="task in props.tasks"
        :key="task.id"
        draggable="true"
        @dragstart="startDrag(task, $event)"
        @dragend="isDragging = null"
        class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition cursor-move group relative"
        :class="[isDragging?.id === task.id ? 'opacity-50 bg-blue-100' : '']"
      >
        <div class="flex items-start gap-2">
          <input
            type="checkbox"
            :checked="task.status === 'завершено'"
            @change="props.onToggleTaskStatus?.(task.id)"
            @click.stop
            class="mt-1 w-4 h-4 rounded flex-shrink-0"
          />

          <div class="flex-1 min-w-0" @click="openTaskInfo(task)">
            <p
              :class="[
                'text-sm font-medium break-words',
                task.status === 'завершено' && 'line-through text-gray-400',
              ]"
            >
              {{ truncateText(task.title, 30) }}
            </p>

            <div class="flex gap-1 mt-2 flex-wrap">
              <span
                :class="[
                  'text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium',
                  getPriorityClass(task.priority),
                ]"
              >
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span
                :class="[
                  'text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium',
                  getStatusClass(task.status),
                ]"
              >
                {{ getStatusLabel(task.status) }}
              </span>
            </div>

            <div v-if="task.dueDate" class="flex items-center gap-1 mt-2">
              <svg
                class="w-3 h-3 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="text-xs text-gray-500">
                {{ formatDate(task.dueDate) }}
              </span>
            </div>

            <div
              v-if="task.tags && task.tags.length > 0"
              class="flex gap-1 mt-2 flex-wrap"
            >
              <span
                v-for="(tag, idx) in task.tags.slice(0, 2)"
                :key="idx"
                class="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded flex-shrink-0"
              >
                {{ truncateText(tag, 12) }}
              </span>
              <button
                v-if="task.tags.length > 2"
                type="button"
                @click.stop="openTaskInfo(task)"
                class="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded flex-shrink-0"
              >
                +{{ task.tags.length - 2 }}
              </button>
            </div>
          </div>

          <div class="relative flex-shrink-0">
            <button
              @click.stop="toggleMenu(task.id)"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 8c1.1 0 2-0.9 2-2s-0.9-2-2-2-2 0.9-2 2 0.9 2 2 2zm0 2c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm0 6c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z"
                />
              </svg>
            </button>

            <Transition name="menu">
              <div
                v-if="openMenuId === task.id"
                class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 w-40"
                @click.stop
              >
                <button
                  @click.stop="
                    () => {
                      openTaskInfo(task);
                      openMenuId = null;
                    }
                  "
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Информация
                </button>
                <button
                  @click.stop="
                    () => {
                      selectedTask = task;
                      showEditTask = true;
                      openMenuId = null;
                    }
                  "
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Редактировать
                </button>
                <button
                  @click.stop="
                    () => {
                      props.onDeleteTask?.(task);
                      openMenuId = null;
                    }
                  "
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Удалить
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <div
          v-if="openMenuId === task.id"
          class="fixed inset-0 z-20"
          @click="openMenuId = null"
        ></div>
      </div>
    </div>

    <button
      @click="openAddTaskModal"
      class="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition flex items-center gap-2 flex-shrink-0"
    >
      <svg
        class="w-4 h-4"
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
      Добавить задачу
    </button>

    <TaskInfoModal
      :is-open="showTaskInfo"
      :task="selectedTask"
      @close="
        () => {
          showTaskInfo = false;
          selectedTask = {} as Task;
        }
      "
      @edit="
        () => {
          showTaskInfo = false;
          showEditTask = true;
        }
      "
    />

    <TaskEditModal
      :is-open="showEditTask"
      :task="selectedTask"
      @close="showEditTask = false"
      @save="handleSaveEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TaskInfoModal from "./TaskInfoModal.vue";
import TaskEditModal from "./TaskEditModal.vue";
import type { Section, Task } from "@/api";

interface DropTaskPayload {
  taskId: string;
  fromSectionId: string;
  toSectionId: string;
}

interface Props {
  section: Section | null;
  tasks: Task[];
  onDeleteTask?: (task: Task) => void;
  onToggleTaskStatus?: (taskId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onOpenAddTaskModal?: (sectionId: string) => void;
  onDropTask?: (payload: DropTaskPayload) => void;
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => [],
});

const isDragOver = ref<boolean>(false);
const isDragging = ref<Task | null>(null);
const showTaskInfo = ref<boolean>(false);
const showEditTask = ref<boolean>(false);
const selectedTask = ref<Task>({} as Task);
const openMenuId = ref<string | null>(null);

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const toggleMenu = (taskId: string): void => {
  openMenuId.value = openMenuId.value === taskId ? null : taskId;
};

const startDrag = (task: Task, event: DragEvent): void => {
  isDragging.value = task;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("taskId", task.id);
    event.dataTransfer.setData("fromSectionId", props.section?.id || "");
  }
};

const handleDrop = (event: DragEvent): void => {
  const taskId = event.dataTransfer?.getData("taskId") || "";
  const fromSectionId = event.dataTransfer?.getData("fromSectionId") || "";

  isDragOver.value = false;

  if (props.onDropTask && props.section) {
    props.onDropTask({
      taskId,
      fromSectionId,
      toSectionId: props.section.id,
    });
  }
};

const openAddTaskModal = (): void => {
  if (props.onOpenAddTaskModal && props.section) {
    props.onOpenAddTaskModal(props.section.id);
  }
};

const deleteSection = (): void => {
  if (props.onDeleteSection && props.section) {
    props.onDeleteSection(props.section.id);
  }
};

const openTaskInfo = (task: Task): void => {
  selectedTask.value = task;
  showTaskInfo.value = true;
};

const handleSaveEdit = (updatedTask: Task): void => {
  showEditTask.value = false;
};

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
  };
  return labels[priority] || "Средний";
};

const getPriorityClass = (priority: string): string => {
  const classes: Record<string, string> = {
    low: "bg-blue-50 text-blue-700",
    medium: "bg-yellow-50 text-yellow-700",
    high: "bg-red-50 text-red-700",
  };
  return classes[priority] || "bg-gray-50 text-gray-700";
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    в_процессе: "В процессе",
    завершено: "Выполнено",
  };
  return labels[status] || "В процессе";
};

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    в_процессе: "bg-blue-50 text-blue-700",
    завершено: "bg-green-50 text-green-700",
  };
  return classes[status] || "bg-gray-50 text-gray-700";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.15s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
