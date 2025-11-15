<template>
  <div class="text-center py-12">
    <svg
      class="mx-auto h-12 w-12 text-gray-300 mb-4"
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
    <h3 class="text-gray-900 font-medium text-lg mb-2">Нет проектов</h3>
    <p class="text-gray-500 text-sm mb-4">
      Создайте первый проект, чтобы начать работу
    </p>
    <button
      @click="emit('create')"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
    >
      Создать проект
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: "create"): void;
}

defineEmits<Emits>();
</script>
