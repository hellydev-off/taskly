<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          :value="props.searchQuery"
          @input="
            props.onSearchChange(($event.target as HTMLInputElement).value)
          "
          type="text"
          placeholder="Поиск задач"
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-todoist-red focus:border-transparent text-sm placeholder-gray-400"
        />
      </div>

      <div class="relative">
        <button
          @click="showFilterModal = !showFilterModal"
          class="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition relative"
          :class="{
            'bg-todoist-red-lighter border-todoist-red': hasActiveFilters,
          }"
        >
          <svg
            class="w-5 h-5"
            :class="{
              'text-todoist-red': hasActiveFilters,
              'text-gray-600': !hasActiveFilters,
            }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>

          <span
            v-if="hasActiveFilters"
            class="absolute -top-1 -right-1 w-5 h-5 bg-todoist-red rounded-full flex items-center justify-center text-white text-xs font-bold"
          >
            {{ activeFiltersCount }}
          </span>
        </button>

        <Transition name="dropdown">
          <div
            v-if="showFilterModal"
            class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-64 p-4 space-y-4"
          >
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Приоритет
              </label>
              <div class="space-y-2">
                <label
                  v-for="priority in priorityOptions"
                  :key="priority.value"
                  class="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded"
                >
                  <input
                    type="radio"
                    :value="priority.value"
                    :checked="props.filterPriority === priority.value"
                    @change="props.onPriorityChange(priority.value)"
                    class="w-4 h-4 rounded border-gray-300 text-todoist-red focus:ring-todoist-red"
                  />
                  <span class="text-sm text-gray-700">{{
                    priority.label
                  }}</span>
                </label>
                <label
                  v-if="props.filterPriority"
                  class="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded text-gray-500 text-sm"
                >
                  <input
                    type="radio"
                    :value="''"
                    :checked="props.filterPriority === ''"
                    @change="props.onPriorityChange('')"
                    class="w-4 h-4 rounded border-gray-300 text-todoist-red focus:ring-todoist-red"
                  />
                  Без фильтра
                </label>
              </div>
            </div>

            <div class="border-t border-gray-200"></div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Теги
              </label>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <label
                  v-for="tag in props.availableTags"
                  :key="tag"
                  class="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    :checked="props.selectedTags.includes(tag)"
                    @change="toggleTag(tag)"
                    class="w-4 h-4 rounded border-gray-300 text-todoist-red focus:ring-todoist-red"
                  />
                  <span class="text-sm text-gray-700">{{ tag }}</span>
                </label>
              </div>
              <button
                v-if="props.selectedTags.length > 0"
                type="button"
                @click="props.onTagsChange([])"
                class="w-full mt-2 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
              >
                Очистить все теги
              </button>
            </div>

            <div class="border-t border-gray-200 pt-3">
              <button
                type="button"
                @click="showFilterModal = false"
                class="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition text-sm"
              >
                Готово
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
      <span class="text-xs text-gray-500 font-medium">Активные фильтры:</span>
      <span
        v-if="props.filterPriority"
        class="inline-flex items-center gap-1 px-2 py-1 bg-todoist-red-lighter text-todoist-red rounded text-xs font-medium"
      >
        {{ getPriorityLabel(props.filterPriority) }}
        <button
          @click="props.onPriorityChange('')"
          class="hover:text-todoist-darkgray ml-0.5"
        >
          ✕
        </button>
      </span>
      <span
        v-for="tag in props.selectedTags"
        :key="tag"
        class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
      >
        {{ tag }}
        <button @click="toggleTag(tag)" class="hover:text-gray-900 ml-0.5">
          ✕
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface PriorityOption {
  label: string;
  value: string;
}

interface Props {
  searchQuery: string;
  filterPriority: string;
  selectedTags: string[];
  availableTags: string[];
  onSearchChange: (query: string) => void;
  onPriorityChange: (priority: string) => void;
  onTagsChange: (tags: string[]) => void;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: "",
  filterPriority: "",
  selectedTags: () => [],
  availableTags: () => [],
});

const showFilterModal = ref<boolean>(false);

const priorityOptions: PriorityOption[] = [
  { label: "Высокий", value: "high" },
  { label: "Средний", value: "medium" },
  { label: "Низкий", value: "low" },
];

const hasActiveFilters = computed<boolean>(
  () => !!props.filterPriority || props.selectedTags.length > 0
);

const activeFiltersCount = computed<number>(
  () => (props.filterPriority ? 1 : 0) + props.selectedTags.length
);

const toggleTag = (tag: string): void => {
  const newTags = props.selectedTags.includes(tag)
    ? props.selectedTags.filter((t) => t !== tag)
    : [...props.selectedTags, tag];
  props.onTagsChange(newTags);
};

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
  };
  return labels[priority] || "";
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
