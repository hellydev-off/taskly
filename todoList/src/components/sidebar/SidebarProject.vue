<template>
  <div>
    <div
      class="flex items-center justify-between group cursor-pointer select-none p-1 rounded-md transition-colors duration-200"
      :class="{
        'bg-hover-gray': isOnProjectsPage,
        'hover:bg-hover-gray': !isOnProjectsPage,
      }"
    >
      <button
        @click="pushTo('/projects')"
        class="text-todoist-black cursor-pointer rounded-md focus:outline-none flex-1 text-left font-medium text-sm"
        :aria-expanded="isOpen"
        :class="{
          'text-todoist-red font-semibold': isOnProjectsPage,
        }"
      >
        Мои проекты
      </button>

      <div class="flex items-center gap-0">
        <div
          @click="changeCreateProjectStation"
          class="p-1 rounded transition-colors duration-200 hover:bg-red-200/30 cursor-pointer"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-125 transform"
          >
            <path
              d="M5.50001 6.50001H0.500007C0.358007 6.50001 0.23934 6.45201 0.144007 6.35601C0.0486736 6.26001 0.000673516 6.14101 6.84931e-06 5.99901C-0.000659817 5.85701 0.0473402 5.73834 0.144007 5.64301C0.240674 5.54767 0.35934 5.50001 0.500007 5.50001H5.50001V0.500007C5.50001 0.358007 5.54801 0.23934 5.64401 0.144007C5.74001 0.0486736 5.85901 0.000673516 6.00101 6.84931e-06C6.14301 -0.000659817 6.26167 0.0473402 6.35701 0.144007C6.45234 0.240674 6.50001 0.35934 6.50001 0.500007V5.50001H11.5C11.642 5.50001 11.7607 5.54801 11.856 5.64401C11.9513 5.74001 11.9993 5.85901 12 6.00101C12.0007 6.14301 11.9527 6.26167 11.856 6.35701C11.7593 6.45234 11.6407 6.50001 11.5 6.50001H6.50001V11.5C6.50001 11.642 6.45201 11.7607 6.35601 11.856C6.26001 11.9513 6.14101 11.9993 5.99901 12C5.85701 12.0007 5.73834 11.9527 5.64301 11.856C5.54767 11.7593 5.50001 11.6407 5.50001 11.5V6.50001Z"
              fill="black"
            />
          </svg>
        </div>

        <div
          @click="toggleOpen"
          class="p-1 rounded transition-colors duration-200 hover:bg-red-200/30 cursor-pointer"
        >
          <svg
            :class="{ 'rotate-90': isOpen }"
            class="w-3 h-3 transition-transform duration-200"
            viewBox="0 0 11 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.71005 10.0058L0.218054 1.27877C0.148138 1.20844 0.0928636 1.12494 0.0554295 1.03311C0.0179953 0.941279 -0.000856243 0.842935 -3.24249e-05 0.74377C0.000791393 0.644604 0.0212736 0.546587 0.0602283 0.45539C0.0991831 0.364193 0.155837 0.281627 0.226912 0.212469C0.297986 0.143312 0.38207 0.0889362 0.474298 0.0524894C0.566527 0.0160426 0.665069 -0.00175181 0.764219 0.000135901C0.86337 0.00202361 0.961161 0.023556 1.05194 0.0634869C1.14271 0.103418 1.22466 0.160954 1.29305 0.232767L10.2931 9.48277C10.4293 9.62278 10.5055 9.81042 10.5055 10.0058C10.5055 10.2011 10.4293 10.3888 10.2931 10.5288L1.29305 19.7788C1.22466 19.8506 1.14271 19.9081 1.05194 19.948C0.961161 19.988 0.86337 20.0095 0.764219 20.0114C0.665069 20.0133 0.566527 19.9955 0.474298 19.959C0.38207 19.9226 0.297986 19.8682 0.226912 19.7991C0.155837 19.7299 0.0991831 19.6473 0.0602283 19.5561C0.0212736 19.4649 0.000791393 19.3669 -3.24249e-05 19.2678C-0.000856243 19.1686 0.0179953 19.0703 0.0554295 18.9784C0.0928636 18.8866 0.148138 18.8031 0.218054 18.7328L8.71005 10.0058Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="mt-2">
      <ul
        v-if="projects && projects.length > 0"
        class="ml-3 pl-3 border-l border-red-300/20 text-gray-700 space-y-0.5"
      >
        <li
          v-for="project in projects"
          :key="project.id"
          class="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors duration-200 cursor-pointer select-none group"
          :class="{
            'bg-hover-gray font-semibold text-todoist-red': isProjectActive(
              project.id
            ),
            'hover:bg-hover-gray': !isProjectActive(project.id),
          }"
        >
          <div
            class="flex items-center gap-2 min-w-0 flex-1"
            @click="pushTo(`/project/${project.id}`)"
          >
            <svg
              width="14"
              height="13"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.473 0.950154C9.52604 0.758403 9.50074 0.553434 9.40266 0.380338C9.30458 0.207242 9.14175 0.0801977 8.95 0.0271544C8.75825 -0.0258889 8.55328 -0.000586741 8.38018 0.0974948C8.20709 0.195576 8.08004 0.358403 8.027 0.550154L6.513 6.00015H2.75C2.55109 6.00015 2.36032 6.07917 2.21967 6.21982C2.07902 6.36048 2 6.55124 2 6.75015C2 6.94907 2.07902 7.13983 2.21967 7.28048C2.36032 7.42114 2.55109 7.50015 2.75 7.50015H6.097L4.569 13.0002H0.75C0.551088 13.0002 0.360322 13.0792 0.21967 13.2198C0.0790177 13.3605 0 13.5512 0 13.7502C0 13.9491 0.0790177 14.1398 0.21967 14.2805C0.360322 14.4211 0.551088 14.5002 0.75 14.5002H4.152L3.027 18.5502C2.97396 18.7419 2.99926 18.9469 3.09734 19.12C3.19542 19.2931 3.35825 19.4201 3.55 19.4732C3.74175 19.5262 3.94672 19.5009 4.11982 19.4028C4.29291 19.3047 4.41996 19.1419 4.473 18.9502L5.709 14.5002H13.152L12.027 18.5502C11.974 18.7419 11.9993 18.9469 12.0973 19.12C12.1954 19.2931 12.3582 19.4201 12.55 19.4732C12.7418 19.5262 12.9467 19.5009 13.1198 19.4028C13.2929 19.3047 13.42 19.1419 13.473 18.9502L14.709 14.5002H18.75C18.9489 14.5002 19.1397 14.4211 19.2803 14.2805C19.421 14.1398 19.5 13.9491 19.5 13.7502C19.5 13.5512 19.421 13.3605 19.2803 13.2198C19.1397 13.0792 18.9489 13.0002 18.75 13.0002H15.126L16.653 7.50015H20.75C20.9489 7.50015 21.1397 7.42114 21.2803 7.28048C21.421 7.13983 21.5 6.94907 21.5 6.75015C21.5 6.55124 21.421 6.36048 21.2803 6.21982C21.1397 6.07917 20.9489 6.00015 20.75 6.00015H17.07L18.473 0.950154C18.4993 0.855209 18.5066 0.75602 18.4945 0.65825C18.4824 0.560481 18.4512 0.466046 18.4027 0.380338C18.3541 0.294629 18.2891 0.219325 18.2115 0.158726C18.1338 0.0981269 18.0449 0.0534188 17.95 0.0271544C17.8551 0.000890017 17.7559 -0.00641618 17.6581 0.00565285C17.5603 0.0177219 17.4659 0.0489297 17.3802 0.0974948C17.2945 0.14606 17.2192 0.211031 17.1586 0.288698C17.098 0.366366 17.0533 0.455209 17.027 0.550154L15.513 6.00015H8.07L9.473 0.950154ZM13.569 13.0002L15.097 7.50015H7.653L6.126 13.0002H13.569Z"
                :fill="project.color"
              />
            </svg>
            <span class="font-normal text-xs text-todoist-textdark truncate">
              {{ project.name }}
            </span>
          </div>

          <button
            @click.stop="confirmDeleteProject(project)"
            class="p-1 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-200/30 cursor-pointer flex-shrink-0"
          >
            <svg
              width="12"
              height="14"
              class="hover:scale-110 transform transition text-todoist-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </li>
      </ul>

      <div v-else class="text-center py-4">
        <span class="text-xs text-gray-500">Проектов нет</span>
      </div>
    </div>

    <WarningDelete
      :isOpen="showDeleteConfirm"
      type="project"
      :itemName="projectToDelete?.name || ''"
      :onConfirm="deleteProject"
      :onCancel="cancelDelete"
    />

    <CreateProject
      :close="changeCreateProjectStation"
      :isOpen="isOpenCreateProjectModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useToast } from "@/composables/useToast";
import CreateProject from "../ui/modals/CreateProject.vue";
import WarningDelete from "../ui/modals/WarningModals/WarningDelete.vue";
import type { Project } from "@/api";

const projectStore = useProjectStore();
const router = useRouter();
const route = useRoute();
const { show } = useToast();

const isOpenCreateProjectModal = ref<boolean>(false);
const isOpen = ref<boolean>(false);
const showDeleteConfirm = ref<boolean>(false);
const projectToDelete = ref<Project | null>(null);

const projects = computed<Project[]>(() => projectStore.allProjects);

const isOnProjectsPage = computed<boolean>(() => {
  return route.path === "/projects";
});

const isProjectActive = (projectId: string): boolean => {
  return route.params.projectId === projectId;
};

watch(
  () => route.params.projectId,
  (projectId) => {
    if (projectId) {
      isOpen.value = true;
    }
  },
  { immediate: true }
);

const pushTo = (path: string): void => {
  router.push(path);
  emit("project-selected");
};

const changeCreateProjectStation = (): void => {
  isOpenCreateProjectModal.value = !isOpenCreateProjectModal.value;
};

const toggleOpen = (): void => {
  isOpen.value = !isOpen.value;
};

const confirmDeleteProject = (project: Project): void => {
  projectToDelete.value = project;
  showDeleteConfirm.value = true;
};

const deleteProject = async (): Promise<void> => {
  try {
    if (!projectToDelete.value) return;

    const projectId = projectToDelete.value.id;
    await projectStore.deleteProject(projectId);
    show("success", "Проект удален!");
    showDeleteConfirm.value = false;
    projectToDelete.value = null;

    if (route.params.projectId === projectId) {
      await router.push("/projects");
      emit("project-selected");
    }
  } catch (error) {
    show("error", "Не удалось удалить проект");
  }
};

const cancelDelete = (): void => {
  showDeleteConfirm.value = false;
  projectToDelete.value = null;
};

const emit = defineEmits<{
  "project-selected": [];
}>();
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
