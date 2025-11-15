<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(4px)"
        @click.self="emit('close')"
      >
        <div
          class="bg-background rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div
            class="sticky top-0 px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-background"
          >
            <h2 class="text-lg font-semibold text-todoist-textdark">
              Информация о задаче
            </h2>
            <button
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0"
            >
              ✕
            </button>
          </div>

          <div class="p-4 sm:p-6 space-y-5">
            <div>
              <p
                class="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Название
              </p>
              <p
                class="text-sm sm:text-base font-medium text-todoist-textdark break-words"
                :title="props.task.title"
              >
                {{ getTruncatedTitle(props.task.title) }}
              </p>
            </div>

            <div v-if="props.task.description">
              <p
                class="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Описание
              </p>
              <p
                class="text-sm text-todoist-textdark whitespace-pre-wrap leading-relaxed break-words"
                :title="props.task.description"
              >
                {{ getTruncatedDescription(props.task.description) }}
              </p>
            </div>

            <div>
              <p
                class="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Статус
              </p>
              <span
                :class="[
                  'inline-block text-xs font-medium px-3 py-1.5 rounded-lg',
                  props.task.status === 'завершено'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-blue-50 text-blue-700',
                ]"
              >
                {{
                  props.task.status === "завершено" ? "Выполнено" : "В процессе"
                }}
              </span>
            </div>

            <div>
              <p
                class="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Приоритет
              </p>
              <span
                :class="[
                  'inline-block text-xs font-medium px-3 py-1.5 rounded-lg',
                  getPriorityClass(props.task.priority),
                ]"
              >
                {{ getPriorityLabel(props.task.priority) }}
              </span>
            </div>

            <div v-if="props.task.dueDate">
              <p
                class="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Срок выполнения
              </p>
              <div
                class="flex items-center gap-2 px-3 py-1.5 bg-todoist-red-lighter rounded-lg w-fit"
              >
                <svg
                  class="w-4 h-4 text-todoist-red flex-shrink-0"
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
                <span class="text-sm font-medium text-todoist-red">
                  {{ formatDate(props.task.dueDate) }}
                </span>
              </div>
            </div>

            <div v-if="props.task.tags && props.task.tags.length > 0">
              <p
                class="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Теги
              </p>
              <div class="flex gap-1.5 flex-wrap">
                <span
                  v-for="(tag, idx) in props.task.tags"
                  :key="idx"
                  class="inline-flex items-center px-2.5 py-1 bg-todoist-lightgray text-todoist-textdark rounded-full text-xs font-medium break-words"
                  :title="tag"
                >
                  {{ getTruncatedTag(tag) }}
                </span>
              </div>
            </div>

            <div
              class="pt-4 border-t border-gray-100 space-y-1 text-xs text-gray-500"
            >
              <p>Создана: {{ formatFullDate(props.task.createdAt) }}</p>
              <p v-if="props.task.updatedAt">
                Обновлена: {{ formatFullDate(props.task.updatedAt) }}
              </p>
            </div>
          </div>

          <div
            class="sticky bottom-0 flex gap-2 p-4 sm:p-6 border-t border-gray-200 bg-background"
          >
            <button
              @click="emit('close')"
              class="flex-1 px-3 py-2 bg-todoist-lightgray hover:bg-hover-gray text-todoist-textdark font-medium rounded-lg transition text-sm"
            >
              Закрыть
            </button>
            <button
              @click="
                () => {
                  emit('close');
                  emit('edit');
                }
              "
              class="flex-1 px-3 py-2 bg-todoist-red hover:bg-todoist-red-light1 text-white font-medium rounded-lg transition text-sm"
            >
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Task } from "@/api";

interface Props {
  isOpen: boolean;
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  edit: [];
}>();

const getTruncatedTitle = (title: string): string => {
  if (!title) return "";
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640)
      return title.length > 40 ? title.substring(0, 40) + "..." : title;
    if (window.innerWidth < 1024)
      return title.length > 50 ? title.substring(0, 50) + "..." : title;
  }
  return title.length > 70 ? title.substring(0, 70) + "..." : title;
};

const getTruncatedDescription = (description: string): string => {
  if (!description) return "";
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640)
      return description.length > 200
        ? description.substring(0, 200) + "..."
        : description;
    if (window.innerWidth < 1024)
      return description.length > 300
        ? description.substring(0, 300) + "..."
        : description;
  }
  return description.length > 400
    ? description.substring(0, 400) + "..."
    : description;
};

const getTruncatedTag = (tag: string): string => {
  if (!tag) return "";
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640)
      return tag.length > 15 ? tag.substring(0, 15) + "..." : tag;
    if (window.innerWidth < 1024)
      return tag.length > 20 ? tag.substring(0, 20) + "..." : tag;
  }
  return tag.length > 25 ? tag.substring(0, 25) + "..." : tag;
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
    high: "bg-todoist-red-lighter text-todoist-red",
  };
  return classes[priority] || "bg-gray-50 text-gray-700";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
