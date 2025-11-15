<template>
  <div class="mb-6">
    <ProjectTasksSearch
      :searchQuery="searchQuery"
      :filterPriority="filterPriority"
      :selectedTags="selectedTags"
      :availableTags="availableTags"
      :onSearchChange="onSearchChange"
      :onPriorityChange="onPriorityChange"
      :onTagsChange="onTagsChange"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectTasksSearch from "./ProjectTasksSearch.vue";

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

const {
  searchQuery,
  filterPriority,
  selectedTags,
  availableTags,
  onSearchChange,
  onPriorityChange,
  onTagsChange,
} = props;
</script>
