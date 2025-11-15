<template>
  <div
    class="border-b border-gray-200 p-4 hover:shadow-md transition cursor-pointer group relative"
    @click="openTaskInfo"
  >
    <div class="flex items-start gap-4">
      <input
        type="checkbox"
        :checked="props.task.status === 'завершено'"
        @change="props.onToggleStatus()"
        @click.stop
        class="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
      />

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h3
            class="font-medium text-sm min-w-0 break-words"
            :class="[
              props.task.status === 'завершено'
                ? 'line-through text-gray-400'
                : 'text-gray-900',
            ]"
            :title="props.task.title"
          >
            {{ getTruncatedTitle(props.task.title) }}
          </h3>
          <span
            :class="[
              'text-xs font-medium px-2 py-1 rounded flex-shrink-0',
              getPriorityClass(props.task.priority),
            ]"
          >
            {{ getPriorityLabel(props.task.priority) }}
          </span>
          <span
            :class="[
              'text-xs font-medium px-2 py-1 rounded flex-shrink-0',
              getStatusClass(props.task.status),
            ]"
          >
            {{ getStatusLabel(props.task.status) }}
          </span>
        </div>

        <p
          v-if="props.task.description"
          class="text-gray-600 text-sm mt-2 line-clamp-2 break-words"
          :title="props.task.description"
        >
          {{ getTruncatedDescription(props.task.description) }}
        </p>

        <div class="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
          <div
            v-if="props.task.dueDate"
            class="flex items-center gap-1 flex-shrink-0 text-xs sm:text-sm"
          >
            <svg
              class="w-4 h-4 text-gray-500 flex-shrink-0"
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
            <span class="text-gray-500">
              {{ formatDate(props.task.dueDate) }}
            </span>
          </div>

          <div
            v-if="props.task.tags && props.task.tags.length > 0"
            class="flex gap-1 sm:gap-2 flex-wrap items-center"
          >
            <span
              v-for="(tag, idx) in visibleTags"
              :key="idx"
              class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap"
            >
              {{ tag }}
            </span>
            <button
              v-if="hiddenTagsCount > 0"
              type="button"
              @click.stop="showAllTags = !showAllTags"
              class="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded flex-shrink-0"
            >
              +{{ hiddenTagsCount }}
            </button>
          </div>
        </div>
      </div>

      <div class="relative flex-shrink-0">
        <button
          @click.stop="showMenu = !showMenu"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 p-2 rounded opacity-0 group-hover:opacity-100 transition"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 8c1.1 0 2-0.9 2-2s-0.9-2-2-2-2 0.9-2 2 0.9 2 2 2zm0 2c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm0 6c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z"
            />
          </svg>
        </button>

        <Transition name="menu">
          <div
            v-if="showMenu"
            class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 w-40"
            @click.stop
          >
            <button
              @click.stop="openTaskInfo"
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
              @click.stop="openEditTask"
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
              @click.stop="handleDelete"
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
      v-if="showMenu"
      class="fixed inset-0 z-20"
      @click="showMenu = false"
    ></div>

    <TaskInfoModal
      :is-open="showTaskInfo"
      :task="props.task"
      @close="showTaskInfo = false"
      @edit="
        () => {
          showTaskInfo = false;
          showEditTask = true;
        }
      "
    />

    <TaskEditModal
      :is-open="showEditTask"
      :task="props.task"
      @close="showEditTask = false"
      @save="handleSaveEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TaskInfoModal from "./TaskInfoModal.vue";
import TaskEditModal from "./TaskEditModal.vue";
import type { Task } from "@/api";

interface Props {
  task: Task;
  onSelect: () => void;
  onToggleStatus: () => void;
  onDelete: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

const props = defineProps<Props>();

const showMenu = ref<boolean>(false);
const showTaskInfo = ref<boolean>(false);
const showEditTask = ref<boolean>(false);

const getTruncatedTitle = (title: string): string => {
  if (!title) return "";
  const maxLengths: Record<string, number> = {};
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640)
      return title.length > 30 ? title.substring(0, 30) + "..." : title;
    if (window.innerWidth < 1024)
      return title.length > 40 ? title.substring(0, 40) + "..." : title;
    if (window.innerWidth < 1280)
      return title.length > 50 ? title.substring(0, 50) + "..." : title;
  }
  return title.length > 60 ? title.substring(0, 60) + "..." : title;
};

const getTruncatedDescription = (description: string): string => {
  if (!description) return "";
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640)
      return description.length > 50
        ? description.substring(0, 50) + "..."
        : description;
    if (window.innerWidth < 1024)
      return description.length > 70
        ? description.substring(0, 70) + "..."
        : description;
    if (window.innerWidth < 1280)
      return description.length > 90
        ? description.substring(0, 90) + "..."
        : description;
  }
  return description.length > 120
    ? description.substring(0, 120) + "..."
    : description;
};

const maxVisibleTags = computed<number>(() => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1280) return 3;
  }
  return 4;
});

const visibleTags = computed<string[]>(() => {
  return (props.task.tags || []).slice(0, maxVisibleTags.value);
});

const hiddenTagsCount = computed<number>(() => {
  return Math.max(0, (props.task.tags?.length || 0) - maxVisibleTags.value);
});

const showAllTags = ref<boolean>(false);

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

const openTaskInfo = (): void => {
  showMenu.value = false;
  showTaskInfo.value = true;
};

const openEditTask = (): void => {
  showTaskInfo.value = false;
  showEditTask.value = true;
};

const handleDelete = (): void => {
  showMenu.value = false;
  props.onDelete(props.task);
};

const handleSaveEdit = (updatedTask: Task): void => {
  showEditTask.value = false;
  props.onEdit?.(updatedTask);
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
