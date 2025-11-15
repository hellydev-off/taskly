<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 w-80 hover:shadow-lg transition-shadow duration-300"
  >
    <div class="h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>

    <div class="flex items-center gap-3 p-4">
      <div
        class="flex-shrink-0 w-8 h-8 bg-green-50 rounded-md flex items-center justify-center"
      >
        <svg
          class="w-4 h-4 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 text-xs">Успешно</h3>
        <p class="text-gray-600 text-xs mt-0.5 line-clamp-1">{{ text }}</p>
      </div>

      <button
        @click="$emit('close')"
        class="flex-shrink-0 text-gray-400 hover:text-gray-600 p-0.5 transition"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="h-0.5 bg-gray-100 overflow-hidden">
      <div
        class="h-full bg-green-500"
        :style="{
          width: `${progress}%`,
          transition: 'width 0.05s linear',
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineProps({
  text: {
    type: String,
    default: "Операция успешно выполнена",
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["close"]);

const progress = ref(100);
let animationId = null;
let startTime = null;

onMounted(() => {
  startTime = performance.now();

  const updateProgress = (currentTime) => {
    const elapsed = currentTime - startTime;
    const percentage = Math.max(0, 100 - (elapsed / 3000) * 100);

    progress.value = percentage;

    if (percentage > 0) {
      animationId = requestAnimationFrame(updateProgress);
    } else {
      emit("close");
    }
  };

  animationId = requestAnimationFrame(updateProgress);
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>
