<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[9999] space-y-3 max-w-md">
      <TransitionGroup name="toast" appear>
        <div v-for="toast in toastQueue" :key="toast.id">
          <ToastSuccess
            v-if="toast.type === 'success'"
            :text="toast.message"
            @close="close(toast.id)"
          />
          <ToastError
            v-else-if="toast.type === 'error'"
            :text="toast.message"
            @close="close(toast.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/useToast";
import ToastSuccess from "./ToastSuccess.vue";
import ToastError from "./ToastError.vue";

const { toastQueue, close } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(400px) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(400px) translateY(-20px);
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>
