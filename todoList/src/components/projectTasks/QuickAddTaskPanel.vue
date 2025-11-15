<template>
  <div
    class="rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
    @click="toggleExpanded"
  >
    <div v-if="!isExpanded" class="flex items-center gap-3">
      <svg
        class="w-5 h-5 text-gray-400 flex-shrink-0"
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
      <input
        type="text"
        placeholder="Добавить задачу"
        class="flex-1 bg-transparent text-gray-600 text-sm focus:outline-none placeholder-gray-400 cursor-pointer"
        @click.stop
        @focus="expandPanel"
      />
    </div>

    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <div>
        <input
          v-model="formData.title"
          ref="titleInput"
          type="text"
          placeholder="Название задачи"
          class="w-full px-0 py-2 bg-transparent text-gray-900 font-medium text-base focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-todoist-red transition"
          maxlength="150"
        />
      </div>

      <div>
        <textarea
          v-model="formData.description"
          placeholder="Описание"
          maxlength="500"
          rows="2"
          class="w-full px-0 py-2 bg-transparent text-gray-600 text-sm focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-todoist-red transition resize-none"
        ></textarea>
      </div>

      <div class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <button
          type="button"
          @click.prevent.stop="showDatePicker = !showDatePicker"
          class="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded transition"
          :class="{
            'bg-todoist-red-lighter text-todoist-red': formData.dueDate,
          }"
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

        <div class="relative">
          <button
            type="button"
            @click.prevent.stop="showPriorityDropdown = !showPriorityDropdown"
            class="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded transition"
            :class="{
              'bg-todoist-red-lighter text-todoist-red':
                formData.priority !== 'medium',
            }"
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
            {{ getPriorityLabel(formData.priority) }}
          </button>

          <Transition name="dropdown">
            <div
              v-if="showPriorityDropdown"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-32"
            >
              <button
                v-for="priority in priorityOptions"
                :key="priority.value"
                type="button"
                @click.prevent.stop="selectPriority(priority.value)"
                class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-xs border-b last:border-b-0"
                :class="{
                  'bg-todoist-red-lighter':
                    formData.priority === priority.value,
                }"
              >
                <span>{{ priority.label }}</span>
                <span
                  v-if="formData.priority === priority.value"
                  class="text-todoist-red"
                  >✓</span
                >
              </button>
            </div>
          </Transition>
        </div>

        <div class="relative z-30">
          <button
            type="button"
            @click.prevent.stop="showTagsDropdown = !showTagsDropdown"
            class="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded transition text-xs"
            :class="{
              'bg-todoist-red-lighter text-todoist-red':
                formData.tags.length > 0,
            }"
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {{
              formData.tags.length > 0
                ? `${formData.tags.length}/5 тэг`
                : "Теги"
            }}
          </button>

          <Transition name="dropdown">
            <div
              v-if="showTagsDropdown"
              class="fixed left-0 right-0 sm:absolute sm:left-auto sm:right-auto sm:top-full sm:mt-1 sm:w-56 bg-white border border-gray-200 sm:rounded-lg shadow-lg z-50 sm:z-20 mx-4 sm:mx-0 rounded-t-lg max-h-96 flex flex-col"
            >
              <div
                v-if="formData.tags.length >= 5"
                class="p-2 text-xs text-red-600 bg-red-50 border-b"
              >
                Максимум 5 тегов достигнут
              </div>

              <div
                v-if="tagsInput.length > 0"
                class="p-2 space-y-2 overflow-y-auto flex-1"
              >
                <label
                  v-for="tag in tagsInput"
                  :key="tag"
                  class="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded text-xs"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      !formData.tags.includes(tag) && formData.tags.length >= 5,
                  }"
                >
                  <input
                    type="checkbox"
                    :checked="formData.tags.includes(tag)"
                    :disabled="
                      !formData.tags.includes(tag) && formData.tags.length >= 5
                    "
                    @change="toggleTag(tag)"
                    class="w-3 h-3 rounded border-gray-300 text-todoist-red"
                  />
                  <span class="text-gray-700">{{ tag }}</span>
                </label>
              </div>

              <div class="p-2 border-t border-gray-200">
                <input
                  v-model="newTagInput"
                  type="text"
                  placeholder="Новый тэг..."
                  :disabled="formData.tags.length >= 5"
                  @keydown.enter.prevent="addNewTag"
                  @click.stop
                  class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-todoist-red disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div
                v-if="formData.tags.length > 0"
                class="p-2 space-y-1 border-t border-gray-200"
              >
                <div class="text-xs text-gray-500 font-medium mb-1">
                  Выбранные: {{ formData.tags.length }}/5
                </div>
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in formData.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-todoist-red-lighter text-todoist-red rounded text-xs"
                  >
                    {{ tag }}
                    <button
                      type="button"
                      @click.prevent.stop="toggleTag(tag)"
                      class="hover:text-todoist-darkgray"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <span class="ml-auto text-xs">{{ formData.title.length }}/150</span>
      </div>

      <div v-if="showDatePicker" class="mt-3 pt-3 border-t border-gray-200">
        <input
          v-model="formData.dueDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-todoist-red"
        />
      </div>

      <div class="flex items-center gap-2 text-xs">
        <svg
          class="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
          />
        </svg>
        <span class="text-gray-500 font-medium">{{ props.projectName }}</span>
      </div>

      <div class="flex gap-2 pt-3 border-t border-gray-200">
        <button
          type="button"
          @click.prevent.stop="cancelForm"
          class="flex-1 px-3 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition text-sm"
        >
          Отмена
        </button>
        <button
          type="submit"
          :disabled="!formData.title.trim() || isSubmitting"
          class="flex-1 px-3 py-2 bg-todoist-red hover:bg-todoist-red-light1 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {{ isSubmitting ? "Добавляю..." : "Добавить задачу" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";

interface PriorityOption {
  label: string;
  value: string;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  tags: string[];
}

interface SubmitData {
  title: string;
  description: string;
  dueDate: string | null;
  priority: string;
  tags: string[];
  sectionId: string | null;
}

interface Props {
  projectName: string;
  onSubmit: (data: SubmitData) => Promise<void>;
  onCancel?: () => void;
  availableTags: string[];
  defaultSectionId: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  projectName: "Проект",
  availableTags: () => [],
  defaultSectionId: null,
  onCancel: () => {},
});

const isExpanded = ref<boolean>(false);
const showDatePicker = ref<boolean>(false);
const showPriorityDropdown = ref<boolean>(false);
const showTagsDropdown = ref<boolean>(false);
const newTagInput = ref<string>("");
const titleInput = ref<HTMLInputElement | null>(null);
const isSubmitting = ref<boolean>(false);

const priorityOptions: PriorityOption[] = [
  { label: "Высокий", value: "high" },
  { label: "Средний", value: "medium" },
  { label: "Низкий", value: "low" },
];

const formData = reactive<TaskFormData>({
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  tags: [],
});

const tagsInput = ref<string[]>([...props.availableTags]);

const expandPanel = async (): Promise<void> => {
  isExpanded.value = true;
  await nextTick();
  titleInput.value?.focus();
};

const toggleExpanded = (): void => {
  if (!isExpanded.value) {
    expandPanel();
  }
};

const selectPriority = (priority: string): void => {
  formData.priority = priority;
  showPriorityDropdown.value = false;
};

const toggleTag = (tag: string): void => {
  console.log("🏷️ Toggling tag:", tag, "Current tags:", formData.tags);

  if (formData.tags.includes(tag)) {
    const index = formData.tags.indexOf(tag);
    if (index !== -1) {
      formData.tags.splice(index, 1);
    }
  } else {
    if (formData.tags.length < 5) {
      formData.tags.push(tag);
    }
  }

  console.log("🏷️ After toggle:", formData.tags);
};

const addNewTag = (): void => {
  const tag = newTagInput.value.trim();
  console.log("➕ Adding new tag:", tag);

  if (tag && !tagsInput.value.includes(tag)) {
    if (formData.tags.length < 5) {
      tagsInput.value.push(tag);
      toggleTag(tag);
      newTagInput.value = "";
      console.log("✅ Tag added");
    }
  }
};

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
  };
  return labels[priority] || "Средний";
};

const handleEnter = (event: KeyboardEvent): void => {
  const target = event.target as HTMLElement;
  if (
    target.tagName === "INPUT" &&
    (target as HTMLInputElement).placeholder === "Новый тэг..."
  ) {
    return;
  }
  submitForm();
};

const submitForm = async (): Promise<void> => {
  if (!formData.title.trim() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await props.onSubmit({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate || null,
      priority: formData.priority,
      tags: formData.tags,
      sectionId: props.defaultSectionId,
    });

    resetForm();
    isExpanded.value = false;
  } catch (error) {
    console.error("Error submitting task:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelForm = (): void => {
  resetForm();
  isExpanded.value = false;
  props.onCancel?.();
};

const resetForm = (): void => {
  formData.title = "";
  formData.description = "";
  formData.dueDate = "";
  formData.priority = "medium";
  formData.tags = [];
  showDatePicker.value = false;
  showPriorityDropdown.value = false;
  showTagsDropdown.value = false;
  newTagInput.value = "";
};
</script>

<style scoped>
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
