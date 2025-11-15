<template>
  <div class="px-8">
    <h2
      v-if="props.projects.length > 0"
      class="text-base font-medium text-gray-900 mb-4"
    >
      {{ projectsCount }} проекта
    </h2>

    <div class="border-b border-gray-200"></div>

    <div v-if="props.projects.length > 0" class="space-y-4 py-8">
      <ProjectCard
        v-for="project in props.projects"
        :key="project.id"
        :project="project"
        @click="emit('select', project.id)"
        @delete="emit('delete', project)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProjectCard from "./ProjectCard.vue";
import type { Project } from "@/api";

interface Props {
  projects: Project[];
}

interface Emits {
  (e: "select", id: string): void;
  (e: "delete", project: Project): void;
}

const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
});

const emit = defineEmits<Emits>();

const projectsCount = computed<number>(() => props.projects.length);
</script>
