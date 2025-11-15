<template>
  <div>
    <NoProjects v-if="props.locale === 'projects'" />
  </div>
</template>

<script setup lang="ts">
import NoProjects from "./Options/NoProjects.vue";

interface Props {
  locale: string;
}

const props = withDefaults(defineProps<Props>(), {
  locale: "None",
});
</script>
