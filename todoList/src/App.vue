<template>
  <div>
    <Toast />

    <Sidebar v-if="!isAuthPage" />

    <div :class="['transition-all duration-300', !isAuthPage && 'md:ml-56']">
      <div class="min-h-screen bg-background">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Toast from "./components/ui/modals/AnswerModal/Toast.vue";

const route = useRoute();

const isAuthPage = computed<boolean>(() => {
  return route.path.startsWith("/auth");
});
</script>
