import { ref } from "vue";

export interface Toast {
  id: number;
  type: "success" | "error" | string;
  message: string;
  duration: number;
}

let toastId = 0;

const toastQueue = ref<Toast[]>([]);

export const useToast = () => {
  const show = (
    type: "success" | "error" | string = "success",
    message = "Операция выполнена",
    duration = 3000
  ) => {
    const id = toastId++;
    const toast: Toast = {
      id,
      type,
      message,
      duration,
    };

    toastQueue.value.push(toast);

    setTimeout(() => {
      toastQueue.value = toastQueue.value.filter((t) => t.id !== id);
    }, duration);
  };

  const success = (message = "Операция успешно выполнена") => {
    show("success", message, 3000);
  };

  const error = (message = "Произошла ошибка") => {
    show("error", message, 3000);
  };

  const close = (id: number) => {
    toastQueue.value = toastQueue.value.filter((t) => t.id !== id);
  };

  return {
    toastQueue,
    show,
    success,
    error,
    close,
  };
};
