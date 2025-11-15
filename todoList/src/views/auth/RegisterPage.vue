<template>
  <AuthLayout>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Регистрация</h2>

      <div
        v-if="authStore.error"
        class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
      >
        {{ authStore.error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2"
          >Email</label
        >
        <input
          v-model="formData.email"
          type="email"
          placeholder="user@example.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-todoist-red"
          required
          :disabled="authStore.isLoading"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">
          Имя пользователя
        </label>
        <input
          v-model="formData.username"
          type="text"
          placeholder="john_doe"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-todoist-red"
          required
          :disabled="authStore.isLoading"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2"
          >Пароль</label
        >
        <input
          v-model="formData.password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-todoist-red"
          required
          minlength="6"
          :disabled="authStore.isLoading"
        />
        <p class="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">
          Подтвердить пароль
        </label>
        <input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-todoist-red"
          required
          :disabled="authStore.isLoading"
        />
      </div>

      <button
        type="submit"
        :disabled="authStore.isLoading || !isFormValid"
        class="w-full px-4 py-2 bg-todoist-red hover:bg-todoist-red-light1 text-white font-medium rounded-lg transition disabled:opacity-50"
      >
        {{ authStore.isLoading ? "Загрузка..." : "Зарегистрироваться" }}
      </button>
    </form>

    <template #footer>
      <p class="text-gray-600">
        Уже есть аккаунт?
        <RouterLink
          to="/auth/login"
          class="text-todoist-red hover:underline font-medium"
        >
          Войти
        </RouterLink>
      </p>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/composables/useToast";
import AuthLayout from "./AuthLayout.vue";

const router = useRouter();
const authStore = useAuthStore();
const { show } = useToast();

const formData = ref({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.email &&
    formData.value.username &&
    formData.value.password &&
    formData.value.password === formData.value.confirmPassword
  );
});

const handleRegister = async (): Promise<void> => {
  if (!isFormValid.value) {
    show("error", "Заполните все поля корректно");
    return;
  }

  try {
    await authStore.register(
      formData.value.email,
      formData.value.username,
      formData.value.password
    );
    show("success", "Регистрация успешна!");
    location.reload();
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>
