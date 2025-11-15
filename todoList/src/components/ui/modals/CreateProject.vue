<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(4px)"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div
            class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-lg font-semibold text-gray-900">Добавить проект</h2>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 hover:text-gray-600 text-xl hover:bg-gray-100 p-1 rounded transition"
              :disabled="loading"
            >
              ✕
            </button>
          </div>

          <div
            v-if="error"
            class="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
          >
            {{ error }}
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1"
                >Имя</label
              >
              <div class="relative">
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="Название проекта"
                  maxlength="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
                  :disabled="loading"
                  required
                />
                <span
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400"
                >
                  {{ formData.name.length }}/100
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1"
                >Описание</label
              >
              <textarea
                v-model="formData.description"
                placeholder="Описание проекта"
                maxlength="500"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition resize-none"
                :disabled="loading"
              ></textarea>
              <div class="text-xs text-gray-400 text-right mt-0.5">
                {{ formData.description.length }}/500
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1"
                >Цвет</label
              >
              <div class="relative">
                <button
                  type="button"
                  @click="toggleDropdown('color')"
                  :disabled="loading"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition bg-white flex items-center justify-between hover:border-gray-400 text-sm disabled:opacity-50"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-4 h-4 rounded border border-gray-300"
                      :style="{ backgroundColor: formData.color }"
                    ></div>
                    <span class="text-gray-700 text-sm">{{
                      getColorLabel(formData.color)
                    }}</span>
                  </div>
                  <svg
                    class="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                <Transition name="dropdown">
                  <div
                    v-if="openDropdown === 'color'"
                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto"
                  >
                    <button
                      v-for="color in colorOptions"
                      :key="color.value"
                      type="button"
                      @click="selectColor(color.value)"
                      :disabled="loading"
                      class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-b last:border-b-0 transition text-sm disabled:opacity-50"
                      :class="{
                        'bg-todoist-red-lighter':
                          formData.color === color.value,
                      }"
                    >
                      <div
                        class="w-3 h-3 rounded border border-gray-300 flex-shrink-0"
                        :style="{ backgroundColor: color.value }"
                      ></div>
                      <span class="text-gray-700 flex-1">{{
                        color.label
                      }}</span>
                      <span
                        v-if="formData.color === color.value"
                        class="text-todoist-red text-xs"
                        >✓</span
                      >
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2"
                >Тип представления</label
              >
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="formData.viewType = 'list'"
                  :disabled="loading"
                  :class="[
                    'p-2 border-2 rounded-lg transition flex flex-col items-center justify-center gap-1 disabled:opacity-50',
                    formData.viewType === 'list'
                      ? 'border-todoist-red bg-todoist-red-lighter'
                      : 'border-gray-300 bg-white hover:border-gray-400',
                  ]"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 8.5C15 8.63261 14.9473 8.75979 14.8536 8.85355C14.7598 8.94732 14.6326 9 14.5 9H3.5C3.36739 9 3.24021 8.94732 3.14645 8.85355C3.05268 8.75979 3 8.63261 3 8.5C3 8.36739 3.05268 8.24021 3.14645 8.14645C3.24021 8.05268 3.36739 8 3.5 8H14.5C14.6326 8 14.7598 8.05268 14.8536 8.14645C14.9473 8.24021 15 8.36739 15 8.5ZM3.5 5H14.5C14.6326 5 14.7598 4.94732 14.8536 4.85355C14.9473 4.75979 15 4.63261 15 4.5C15 4.36739 14.9473 4.24021 14.8536 4.14645C14.7598 4.05268 14.6326 4 14.5 4H3.5C3.36739 4 3.24021 4.05268 3.14645 4.14645C3.05268 4.24021 3 4.36739 3 4.5C3 4.63261 3.05268 4.75979 3.14645 4.85355C3.24021 4.94732 3.36739 5 3.5 5ZM14.5 12H3.5C3.36739 12 3.24021 12.0527 3.14645 12.1464C3.05268 12.2402 3 12.3674 3 12.5C3 12.6326 3.05268 12.7598 3.14645 12.8536C3.24021 12.9473 3.36739 13 3.5 13H14.5C14.6326 13 14.7598 12.9473 14.8536 12.8536C14.9473 12.7598 15 12.6326 15 12.5C15 12.3674 14.9473 12.2402 14.8536 12.1464C14.7598 12.0527 14.6326 12 14.5 12Z"
                      :fill="formData.viewType === 'list' ? '#E44332' : 'black'"
                    />
                    <rect
                      x="0.5"
                      y="0.5"
                      width="17"
                      height="16"
                      rx="1.5"
                      :stroke="
                        formData.viewType === 'list' ? '#E44332' : 'black'
                      "
                    />
                  </svg>
                  <span class="text-xs font-medium text-gray-900">Список</span>
                </button>

                <button
                  type="button"
                  @click="formData.viewType = 'board'"
                  :disabled="loading"
                  :class="[
                    'p-2 border-2 rounded-lg transition flex flex-col items-center justify-center gap-1 disabled:opacity-50',
                    formData.viewType === 'board'
                      ? 'border-todoist-red bg-todoist-red-lighter'
                      : 'border-gray-300 bg-white hover:border-gray-400',
                  ]"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 2.5C9.13261 2.5 9.25979 2.55268 9.35355 2.64645C9.44732 2.74021 9.5 2.86739 9.5 3V14C9.5 14.1326 9.44732 14.2598 9.35355 14.3536C9.25979 14.4473 9.13261 14.5 9 14.5C8.86739 14.5 8.74021 14.4473 8.64645 14.3536C8.55268 14.2598 8.5 14.1326 8.5 14V3C8.5 2.86739 8.55268 2.74021 8.64645 2.64645C8.74021 2.55268 8.86739 2.5 9 2.5ZM5.5 14L5.5 3C5.5 2.86739 5.44732 2.74021 5.35355 2.64645C5.25979 2.55268 5.13261 2.5 5 2.5C4.86739 2.5 4.74021 2.55268 4.64645 2.64645C4.55268 2.74021 4.5 2.86739 4.5 3L4.5 14C4.5 14.1326 4.55268 14.2598 4.64645 14.3536C4.74021 14.4473 4.86739 14.5 5 14.5C5.13261 14.5 5.25979 14.4473 5.35355 14.3536C5.44732 14.2598 5.5 14.1326 5.5 14ZM12.5 3V14C12.5 14.1326 12.5527 14.2598 12.6464 14.3536C12.7402 14.4473 12.8674 14.5 13 14.5C13.1326 14.5 13.2598 14.4473 13.3536 14.3536C13.4473 14.2598 13.5 14.1326 13.5 14V3C13.5 2.86739 13.4473 2.74021 13.3536 2.64645C13.2598 2.55268 13.1326 2.5 13 2.5C12.8674 2.5 12.7402 2.55268 12.6464 2.64645C12.5527 2.74021 12.5 2.86739 12.5 3Z"
                      :fill="
                        formData.viewType === 'board' ? '#E44332' : 'black'
                      "
                    />
                    <rect
                      x="0.5"
                      y="0.5"
                      width="17"
                      height="16"
                      rx="1.5"
                      :stroke="
                        formData.viewType === 'board' ? '#E44332' : 'black'
                      "
                    />
                  </svg>
                  <span class="text-xs font-medium text-gray-900">Доска</span>
                </button>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                :disabled="loading"
                class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="formData.name.trim().length < 3 || loading"
                class="flex-1 px-3 py-2 bg-todoist-red hover:bg-todoist-red-light1 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                <span v-if="!loading">Добавить</span>
                <span v-else class="inline-block animate-spin">⟳</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import { useToast } from "@/composables/useToast";

interface ColorOption {
  label: string;
  value: string;
}

interface FormData {
  name: string;
  description: string;
  color: string;
  viewType: "list" | "board";
}

interface Props {
  isOpen: boolean;
  close: () => void;
}

const { show } = useToast();
const projectStore = useProjectStore();

const props = defineProps<Props>();

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const openDropdown = ref<string | null>(null);

const colorOptions: ColorOption[] = [
  { label: "Красный", value: "#E44332" },
  { label: "Аспидно-серый", value: "#6B7280" },
  { label: "Оранжевый", value: "#F97316" },
  { label: "Янтарь", value: "#FBBF24" },
  { label: "Салатовый", value: "#84CC16" },
  { label: "Зелёный", value: "#10B981" },
  { label: "Мятный", value: "#14B8A6" },
  { label: "Голубой", value: "#06B6D4" },
  { label: "Синий", value: "#3B82F6" },
  { label: "Индиго", value: "#6366F1" },
  { label: "Фиолетовый", value: "#A855F7" },
  { label: "Розовый", value: "#EC4899" },
];

const formData = reactive<FormData>({
  name: "",
  description: "",
  color: "#E44332",
  viewType: "list",
});

const toggleDropdown = (dropdown: string): void => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
};

const getColorLabel = (colorValue: string): string => {
  const color = colorOptions.find((c) => c.value === colorValue);
  return color?.label || "Выберите цвет";
};

const selectColor = (color: string): void => {
  formData.color = color;
  openDropdown.value = null;
};

const closeModal = (): void => {
  resetForm();
  props.close();
};

const submitForm = async (): Promise<void> => {
  if (!formData.name.trim()) {
    error.value = "Введите название проекта";
    show("error", "Введите название проекта");
    return;
  }

  if (formData.name.trim().length < 3) {
    error.value = "Название должно содержать минимум 3 символа";
    show("error", error.value);
    return;
  }

  if (formData.name.length > 100) {
    error.value = "Название слишком длинное (макс 100 символов)";
    show("error", error.value);
    return;
  }

  if (formData.description.length > 500) {
    error.value = "Описание слишком длинное (макс 500 символов)";
    show("error", error.value);
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const project = await projectStore.createProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      viewType: formData.viewType,
    });

    show("success", `Проект "${formData.name}" успешно создан!`);
    resetForm();
    props.close();
  } catch (err: any) {
    error.value = err.response?.data?.message || "Не удалось создать проект";
    show("error", error.value);
  } finally {
    loading.value = false;
  }
};

const resetForm = (): void => {
  formData.name = "";
  formData.description = "";
  formData.color = "#E44332";
  formData.viewType = "list";
  openDropdown.value = null;
  error.value = null;
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
