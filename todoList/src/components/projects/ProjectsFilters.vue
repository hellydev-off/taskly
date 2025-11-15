<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-700">Только архивированные проекты</span>
    <button
      @click="toggleArchived"
      :class="[
        'relative inline-flex h-6 w-11 rounded-full transition-colors',
        showArchived ? 'bg-blue-500' : 'bg-gray-300',
      ]"
    >
      <span
        :class="[
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
          showArchived ? 'translate-x-5' : 'translate-x-0.5',
        ]"
      ></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showArchived = ref<boolean>(false);

interface Emits {
  (e: "toggle-archived", value: boolean): void;
}

const emit = defineEmits<Emits>();

const toggleArchived = (): void => {
  showArchived.value = !showArchived.value;
  emit("toggle-archived", showArchived.value);
};
</script>
