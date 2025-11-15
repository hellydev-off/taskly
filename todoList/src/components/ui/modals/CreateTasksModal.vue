<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(4px)"
        @click.self="handleClose"
      >
        <div
          class="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div
            class="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"
          >
            <h2 class="text-lg font-semibold text-gray-900">Добавить задачу</h2>
            <button
              @click="handleClose"
              type="button"
              class="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div v-if="isGlobalMode" class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Проект *
              </label>

              <button
                type="button"
                @click="showProjectDropdown = !showProjectDropdown"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div
                    v-if="selectedProject"
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: selectedProject.color }"
                  ></div>
                  <span
                    class="text-sm truncate"
                    :class="
                      selectedProject
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500'
                    "
                  >
                    {{ selectedProject?.name || "Выберите проект" }}
                  </span>
                </div>
                <svg
                  :class="{ 'rotate-180': showProjectDropdown }"
                  class="w-4 h-4 text-gray-400 transition-transform"
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
                  v-if="showProjectDropdown"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  <div
                    v-if="availableProjects.length === 0"
                    class="px-4 py-6 text-center"
                  >
                    <p class="text-sm text-gray-500">Нет доступных проектов</p>
                  </div>
                  <div v-else>
                    <button
                      v-for="project in availableProjects"
                      :key="project.id"
                      type="button"
                      @click="selectProject(project)"
                      class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition flex items-center justify-between group border-b border-gray-100 last:border-b-0"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <div
                          class="w-3 h-3 rounded-full flex-shrink-0"
                          :style="{ backgroundColor: project.color }"
                        ></div>
                        <span class="text-sm text-gray-700 truncate">
                          {{ project.name }}
                        </span>
                      </div>
                      <div
                        v-if="selectedProjectId === project.id"
                        class="text-todoist-red flex-shrink-0"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2"
                >Название *</label
              >
              <input
                v-model="formData.title"
                type="text"
                placeholder="Название задачи"
                maxlength="150"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2"
                >Описание</label
              >
              <textarea
                v-model="formData.description"
                placeholder="Описание"
                maxlength="500"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition resize-none"
              ></textarea>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="showDatePicker = !showDatePicker"
                class="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition flex items-center gap-1"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Срок
              </button>

              <button
                type="button"
                @click="showPriorityDropdown = !showPriorityDropdown"
                class="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition flex items-center gap-1"
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Приоритет
              </button>
            </div>

            <div v-if="showDatePicker">
              <input
                v-model="formData.dueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
              />
            </div>

            <div v-if="showPriorityDropdown" class="flex gap-2">
              <button
                v-for="(label, value) in priorityOptions"
                :key="value"
                type="button"
                @click="formData.priority = value"
                class="px-3 py-1.5 text-xs rounded transition flex-1"
                :class="
                  formData.priority === value
                    ? 'bg-todoist-red text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                "
              >
                {{ label }}
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Теги (макс. 5)
              </label>
              <input
                :value="tagInput"
                @input="tagInput = ($event.target as HTMLInputElement).value"
                @keydown="handleTagInput"
                type="text"
                placeholder="Введите тег и нажмите Enter"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-todoist-red transition"
              />

              <div
                v-if="formData.tags.length > 0"
                class="flex gap-2 mt-2 flex-wrap"
              >
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="bg-todoist-red-lighter text-todoist-red px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="hover:font-bold transition"
                  >
                    ✕
                  </button>
                </span>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition text-sm"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="!isFormValid"
                class="flex-1 px-4 py-2 bg-todoist-red hover:bg-todoist-red-light1 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Добавить задачу
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { Project } from "@/api";

interface TaskData {
  title: string;
  description: string;
  dueDate: string | null;
  priority: string;
  tags: string[];
  projectId: string | null;
  sectionId: string | null;
}

interface Props {
  isOpen: boolean;
  locale?: string | null;
  availableProjects?: Project[];
  defaultSectionId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  locale: null,
  availableProjects: () => [],
  defaultSectionId: null,
});

const emit = defineEmits<{
  close: [];
  submit: [data: TaskData];
}>();

const showProjectDropdown = ref(false);
const showDatePicker = ref(false);
const showPriorityDropdown = ref(false);
const tagInput = ref("");
const selectedProjectId = ref<string | null>(null);
const selectedProject = ref<Project | null>(null);

const formData = reactive<TaskData>({
  title: "",
  description: "",
  dueDate: null,
  priority: "medium",
  tags: [],
  projectId: null,
  sectionId: props.defaultSectionId || null,
});

const priorityOptions: Record<string, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

const isGlobalMode = computed(() => props.locale === "Global");

const isFormValid = computed(() => {
  if (isGlobalMode.value) {
    return formData.title.trim() !== "" && selectedProjectId.value !== null;
  }
  return formData.title.trim() !== "";
});

const selectProject = (project: Project) => {
  selectedProjectId.value = project.id;
  selectedProject.value = project;
  showProjectDropdown.value = false;
};

const handleTagInput = (event: KeyboardEvent) => {
  const input = tagInput.value.trim();
  if ((event.key === "," || event.key === "Enter") && input) {
    event.preventDefault();
    if (formData.tags.length < 5 && !formData.tags.includes(input)) {
      formData.tags.push(input);
      tagInput.value = "";
    }
  }
};

const removeTag = (index: number) => {
  formData.tags.splice(index, 1);
};

const handleClose = () => {
  resetForm();
  emit("close");
};

const submitForm = () => {
  if (!isFormValid.value) return;

  emit("submit", {
    title: formData.title,
    description: formData.description,
    dueDate: formData.dueDate || null,
    priority: formData.priority,
    tags: formData.tags,
    projectId: isGlobalMode.value ? selectedProjectId.value : null,
    sectionId: props.defaultSectionId || null,
  });

  resetForm();
};

const resetForm = () => {
  formData.title = "";
  formData.description = "";
  formData.dueDate = null;
  formData.priority = "medium";
  formData.tags = [];
  tagInput.value = "";
  selectedProjectId.value = null;
  selectedProject.value = null;
  showProjectDropdown.value = false;
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
