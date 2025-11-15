<template>
  <div class="flex-1 relative">
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
      @input="emit('search', ($event.target as HTMLInputElement).value)"
      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
    />
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: "search", value: string): void;
}

const emit = defineEmits<Emits>();
</script>
