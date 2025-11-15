<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px)"
        @click.self="handleClose"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
        >
          <h2 class="text-xl font-medium text-gray-900">
            {{ getTitle() }}
          </h2>

          <p class="text-gray-600 text-sm leading-relaxed">
            <span v-if="props.type === 'task'">Задача </span>
            <span v-else>Проект </span>
            <span class="font-semibold text-gray-900">{{
              props.itemName
            }}</span>
            {{ getDescriptionText() }}
          </p>

          <div class="flex gap-2 pt-2">
            <button
              @click="props.onCancel"
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition text-sm"
            >
              Отмена
            </button>
            <button
              @click="handleDelete"
              class="flex-1 px-4 py-2.5 bg-todoist-red hover:bg-todoist-red-light1 text-white font-semibold rounded-lg transition text-sm"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
    validator: (value: string) => ["task", "project"].includes(value),
  },
  itemName: {
    type: String,
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
  onCancel: {
    type: Function,
    required: true,
  },
});

const getTitle = (): string => {
  return props.type === "task" ? "Удалить задачу?" : "Удалить проект?";
};

const getDescriptionText = (): string => {
  if (props.type === "task") {
    return " будет удалена безвозвратно.";
  } else {
    return " со всеми его задачами будет удален безвозвратно.";
  }
};

const handleDelete = (): void => {
  props.onConfirm();
};

const handleClose = (): void => {
  props.onCancel();
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
</style>
