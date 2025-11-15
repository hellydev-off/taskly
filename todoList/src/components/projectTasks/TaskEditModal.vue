<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(4px)"
        @click.self="emit('close')"
      >
        <div class="bg-background rounded-xl shadow-lg w-full max-w-md">
          <div
            class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-lg font-semibold text-todoist-textdark">
              Редактировать задачу
            </h2>
            <button
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Название
              </label>
              <input
                v-model="formData.title"
                type="text"
                placeholder="Введите название"
                maxlength="200"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-todoist-textdark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
              />
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Описание
              </label>
              <textarea
                v-model="formData.description"
                placeholder="Введите описание"
                maxlength="2000"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-todoist-textdark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
                >
                  Статус
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-todoist-textdark focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
                >
                  <option value="в_процессе">В процессе</option>
                  <option value="завершено">Выполнено</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
                >
                  Приоритет
                </label>
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-todoist-textdark focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide"
              >
                Срок выполнения
              </label>
              <input
                v-model="formData.dueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-todoist-textdark focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
              />
            </div>

            <div class="flex gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="emit('close')"
                class="flex-1 px-3 py-2 bg-todoist-lightgray hover:bg-hover-gray text-todoist-textdark font-medium rounded-lg transition text-sm"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="!formData.title.trim()"
                class="flex-1 px-3 py-2 bg-todoist-red hover:bg-todoist-red-light1 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition text-sm"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { Task } from "@/api";

interface FormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  tags: string[];
}

interface Props {
  isOpen: boolean;
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  save: [task: Task];
}>();

const formData = reactive<FormData>({
  title: "",
  description: "",
  status: "в_процессе",
  priority: "medium",
  dueDate: "",
  tags: [],
});

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.task) {
      formData.title = props.task.title;
      formData.description = props.task.description || "";
      formData.status = props.task.status || "в_процессе";
      formData.priority = props.task.priority || "medium";
      formData.dueDate = props.task.dueDate
        ? new Date(props.task.dueDate).toISOString().split("T")[0]
        : "";
      formData.tags = [...(props.task.tags || [])];
    }
  }
);

const submitForm = (): void => {
  if (!formData.title.trim()) {
    alert("Введите название задачи");
    return;
  }

  emit("save", {
    ...props.task,
    title: formData.title,
    description: formData.description,
    status: formData.status as "в_процессе" | "завершено",
    priority: formData.priority,
    dueDate: formData.dueDate || undefined,
    tags: formData.tags,
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
