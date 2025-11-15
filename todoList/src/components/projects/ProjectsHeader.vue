<template>
  <div class="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
    <div class="flex justify-between items-center mb-6 gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-medium text-gray-900">
          Мои проекты
        </h1>
      </div>

      <button
        @click="props.createProject"
        class="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-900 flex-shrink-0"
      >
        <span class="hidden sm:inline text-sm">+ Добавить</span>

        <svg
          class="sm:hidden w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex-1 relative">
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
          type="text"
          placeholder="Поиск проектов"
          @input="(e) => props.onSearch((e.target as HTMLInputElement).value)"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-todoist-red text-sm placeholder-gray-400"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  createProject: () => void;
  onSearch: (query: string) => void;
}

const props = defineProps<Props>();
</script>
