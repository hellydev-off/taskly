<template>
  <div class="space-y-2">
    <div
      v-if="showDebug"
      class="text-xs text-gray-400 mb-2 p-2 bg-gray-100 rounded"
    >
      📌 Tasks received: {{ props.tasks?.length || 0 }} | Debug mode: ON
    </div>

    <div v-if="props.tasks && props.tasks.length > 0" class="space-y-2">
      <ProjectTasksCard
        v-for="task in props.tasks"
        :key="task.id"
        :task="task"
        :onSelect="() => props.onSelectTask(task.id)"
        :onToggleStatus="() => props.onToggleTaskStatus(task.id)"
        :onDelete="(t) => props.onDeleteTask(t)"
        :onEdit="props.onEdit"
      />
    </div>

    <QuickAddTaskPanel
      :projectName="props.projectName"
      :onSubmit="props.onAddTask"
      :onCancel="props.onCancelAdd"
      :availableTags="[]"
      :defaultSectionId="null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import ProjectTasksCard from "./ProjectTasksCard.vue";
import QuickAddTaskPanel from "./QuickAddTaskPanel.vue";
import type { Task } from "@/api";

interface SubmitData {
  title: string;
  description: string;
  dueDate: string | null;
  priority: string;
  tags: string[];
  sectionId: string | null;
}

interface Props {
  tasks: Task[];
  projectName: string;
  onSelectTask: (taskId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (task: Task) => void;
  onAddTask: (taskData: SubmitData) => Promise<void>;
  onCancelAdd: () => void;
  onEdit?: (task: Task) => void;
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => [],
  projectName: "Проект",
  onEdit: () => {},
});

const showDebug = ref<boolean>(false);

watch(
  () => props.tasks,
  (newTasks) => {
    if (newTasks) {
      console.log("📝 ProjectTasksList.vue tasks updated:", {
        length: newTasks.length,
        tasks: newTasks,
      });
    }
  },
  { deep: true, immediate: true }
);
</script>
