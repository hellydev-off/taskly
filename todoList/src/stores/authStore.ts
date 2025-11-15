import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi, type User, type AuthResponse } from "@/api/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(authApi.getCurrentUser());
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed<boolean>(() => {
    return authApi.isAuthenticated() && !!user.value;
  });

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await authApi.register(email, username, password);

      user.value = {
        id: data.id,
        email: data.email,
        username: data.username,
      };

      return data;
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Ошибка при регистрации";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await authApi.login(username, password);

      user.value = {
        id: data.id,
        email: data.email,
        username: data.username,
      };

      return data;
    } catch (err) {
      error.value = (err as any).response?.data?.message || "Ошибка при входе";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = (): void => {
    authApi.logout();
    user.value = null;
    error.value = null;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
  };
});
