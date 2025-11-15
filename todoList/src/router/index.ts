import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
import ProjectsPage from "@/views/ProjectsPage.vue";
import ProjectPage from "@/views/ProjectPage.vue";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "Auth",
    children: [
      {
        path: "login",
        name: "Login",
        component: LoginPage,
        meta: {
          title: "Taskly | Вход",
          requiresAuth: false,
        },
      },
      {
        path: "register",
        name: "Register",
        component: RegisterPage,
        meta: {
          title: "Taskly | Регистрация",
          requiresAuth: false,
        },
      },
    ],
  },

  {
    path: "/",
    redirect: () => {
      const authStore = useAuthStore();
      return authStore.isAuthenticated ? "/projects" : "/auth/login";
    },
  },

  {
    path: "/project/:projectId",
    name: "Project",
    component: ProjectPage,
    meta: {
      title: "Taskly | Проект",
      requiresAuth: true,
    },
  },

  {
    path: "/projects",
    name: "Projects",
    component: ProjectsPage,
    meta: {
      title: "Taskly | Мои проекты",
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    const title = (to.meta.title as string) || "Taskly";
    document.title = title;

    if (to.meta.requiresAuth && !isAuthenticated) {
      next("/auth/login");
      return;
    }

    if (to.path.startsWith("/auth") && isAuthenticated) {
      next("/projects");
      return;
    }

    next();
  }
);

export default router;
