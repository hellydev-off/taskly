<template>
  <div>
    <Transition name="button-appear">
      <button
        v-if="!isSidebarOpen"
        @click="isSidebarOpen = !isSidebarOpen"
        class="fixed bottom-6 left-6 z-40 md:hidden p-3 bg-todoist-red rounded-full hover:bg-todoist-red-light1 transition shadow-lg hover:shadow-xl"
      >
        <svg
          class="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </Transition>

    <Transition name="overlay">
      <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
      ></div>
    </Transition>

    <aside
      :class="[
        'fixed top-0 left-0 h-screen w-56 bg-todoist-red-lighter shadow-lg overflow-y-auto transition-transform duration-300 z-50',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="p-3 flex flex-col h-full">
        <div class="flex items-center justify-between gap-2 mb-6">
          <div class="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.271 0.112C1.461 0.218 1.033 0.413 0.727 0.712C0.422 1.012 0.223 1.432 0.114 2.225C0.001 3.042 0 4.124 0 5.675V14.245C0.395 13.974 0.835 13.774 1.299 13.652C1.827 13.513 2.443 13.513 3.346 13.514H16V5.676C16 4.124 15.998 3.042 15.886 2.225C15.777 1.432 15.578 1.012 15.273 0.712C14.967 0.413 14.539 0.218 13.729 0.112C12.895 0.002 11.791 0 10.207 0H5.793C4.209 0 3.105 0.002 2.271 0.112ZM2.759 4.595C2.759 4.147 3.129 3.784 3.586 3.784H12.414C12.631 3.782 12.839 3.866 12.995 4.018C13.15 4.17 13.238 4.377 13.241 4.594C13.239 4.811 13.151 5.018 12.995 5.17C12.84 5.323 12.631 5.407 12.414 5.405H3.586C3.369 5.407 3.16 5.323 3.005 5.171C2.85 5.019 2.762 4.812 2.759 4.595ZM3.586 7.568C3.369 7.566 3.16 7.65 3.005 7.802C2.85 7.954 2.762 8.161 2.759 8.378C2.759 8.826 3.129 9.189 3.586 9.189H9.103C9.32 9.191 9.529 9.107 9.684 8.955C9.839 8.803 9.928 8.596 9.931 8.379C9.929 8.162 9.84 7.954 9.684 7.802C9.53 7.65 9.32 7.566 9.103 7.568H3.586Z"
                fill="#E44332"
              />
              <path
                d="M3.473 15.135H16C15.997 16.265 15.979 17.109 15.887 17.775C15.778 18.568 15.579 18.988 15.274 19.288C14.968 19.588 14.54 19.783 13.73 19.888C12.896 19.998 11.792 20 10.208 20H5.793C4.209 20 3.105 19.998 2.271 19.89C1.461 19.783 1.033 19.588 0.727 19.288C0.422 18.988 0.223 18.568 0.114 17.775C0.073 17.475 0.046 17.139 0.03 16.755C0.167 16.38 0.393 16.045 0.689 15.777C0.984 15.509 1.341 15.317 1.727 15.218C2.017 15.142 2.394 15.135 3.473 15.135Z"
                fill="#E44332"
              />
            </svg>
            <h2 class="text-lg font-semibold text-todoist-black">Taskly</h2>
          </div>

          <div class="flex items-center gap-1">
            <button
              @click="isSidebarOpen = false"
              class="md:hidden p-1.5 hover:bg-red-200/40 rounded-full transition duration-200 group"
            >
              <svg
                class="w-5 h-5 text-todoist-red/70 group-hover:text-todoist-red transition"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="cursor-pointer hover:opacity-70 transition-opacity p-1"
              >
                <svg
                  width="4"
                  height="12"
                  viewBox="0 0 2 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 1C0 0.86 -1.03377e-07 0.791 0.0079999 0.733C0.0334542 0.549708 0.118029 0.37973 0.248879 0.248879C0.37973 0.118029 0.549708 0.0334542 0.733 0.0079999C0.79 -1.03377e-07 0.86 0 1 0C1.14 0 1.209 -1.03377e-07 1.267 0.0079999C1.45029 0.0334542 1.62027 0.118029 1.75112 0.248879C1.88197 0.37973 1.96655 0.549708 1.992 0.733C2 0.79 2 0.86 2 1C2 1.14 2 1.209 1.992 1.267C1.96655 1.45029 1.88197 1.62027 1.75112 1.75112C1.62027 1.88197 1.45029 1.96655 1.267 1.992C1.21 2 1.14 2 1 2C0.86 2 0.791 2 0.733 1.992C0.549708 1.96655 0.37973 1.88197 0.248879 1.75112C0.118029 1.62027 0.0334542 1.45029 0.0079999 1.267C-1.03377e-07 1.21 0 1.14 0 1ZM0 5C0 4.86 -1.03377e-07 4.791 0.0079999 4.733C0.0334542 4.54971 0.118029 4.37973 0.248879 4.24888C0.37973 4.11803 0.549708 4.03345 0.733 4.008C0.79 4 0.86 4 1 4C1.14 4 1.209 4 1.267 4.008C1.45029 4.03345 1.62027 4.11803 1.75112 4.24888C1.88197 4.37973 1.96655 4.54971 1.992 4.733C2 4.79 2 4.86 2 5C2 5.14 2 5.209 1.992 5.267C1.96655 5.45029 1.88197 5.62027 1.75112 5.75112C1.62027 5.88197 1.45029 5.96655 1.267 5.992C1.21 6 1.14 6 1 6C0.86 6 0.791 6 0.733 5.992C0.549708 5.96655 0.37973 5.88197 0.248879 5.75112C0.118029 5.62027 0.0334542 5.45029 0.0079999 5.267C-1.03377e-07 5.21 0 5.14 0 5ZM0 9C0 8.861 -1.03377e-07 8.791 0.0079999 8.733C0.0336033 8.55003 0.118121 8.38039 0.248757 8.24976C0.379393 8.11912 0.549035 8.0346 0.732 8.009C0.791 8.001 0.86 8.001 0.999 8.001C1.138 8.001 1.209 8.001 1.266 8.009C1.44896 8.0346 1.61861 8.11912 1.74924 8.24976C1.87988 8.38039 1.9644 8.55003 1.99 8.733C1.998 8.791 1.998 8.861 1.998 9C1.998 9.139 1.998 9.209 1.99 9.267C1.9644 9.44997 1.87988 9.61961 1.74924 9.75024C1.61861 9.88088 1.44896 9.9654 1.266 9.991C1.208 9.999 1.138 9.999 0.999 9.999C0.86 9.999 0.79 9.999 0.732 9.999C0.549035 9.9654 0.379393 9.88088 0.248757 9.75024C0.118121 9.61961 0.0336033 9.44997 0.0079999 9.267C-1.03377e-07 9.209 0 9.139 0 9Z"
                    fill="#000"
                    opacity="0.5"
                  />
                </svg>
              </button>

              <Transition name="dropdown">
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p class="text-xs text-gray-500 uppercase tracking-wide">
                      Пользователь
                    </p>
                    <p
                      class="text-sm font-semibold text-gray-900 truncate mt-1"
                    >
                      {{ truncateUsername(authStore.user?.username) }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ authStore.user?.email }}
                    </p>
                  </div>

                  <button
                    @click="handleLogout"
                    class="w-full px-4 py-2.5 text-left text-sm text-todoist-red hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Выход
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div class="h-px bg-red-300/20 mb-4"></div>

        <div class="flex-1 overflow-y-auto">
          <SidebarInfo />

          <div class="h-px bg-red-300/20 my-4"></div>

          <SidebarProject @project-selected="isSidebarOpen = false" />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/composables/useToast";
import SidebarInfo from "./SidebarInfo.vue";
import SidebarProject from "./SidebarProject.vue";

const projectStore = useProjectStore();
const authStore = useAuthStore();
const router = useRouter();
const { show } = useToast();

const showUserMenu = ref<boolean>(false);
const isSidebarOpen = ref<boolean>(false);

const truncateUsername = (username: string | undefined): string => {
  if (!username) return "Пользователь";
  return username.length > 20 ? username.substring(0, 20) + "..." : username;
};

const handleLogout = async (): Promise<void> => {
  try {
    authStore.logout();
    show("success", "Вы вышли из аккаунта");
    showUserMenu.value = false;
    isSidebarOpen.value = false;
    await router.push("/auth/login");
  } catch (error) {
    show("error", "Ошибка при выходе");
  }
};

onMounted(async () => {
  try {
    await projectStore.fetchProjects();
  } catch (error) {
    console.error("Error loading projects:", error);
  }
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.button-appear-enter-active,
.button-appear-leave-active {
  transition: all 0.3s ease;
}

.button-appear-enter-from,
.button-appear-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
