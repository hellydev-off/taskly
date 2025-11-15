import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { tasksApi, type Task, type CreateTaskPayload } from "@/api";
import { useProjectStore } from "./projectStore";
import { useSectionStore } from "./sectionStore";

export const useTaskStore = defineStore("tasks", () => {
  const projectStore = useProjectStore();

  const tasks = ref<Task[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const projectTasks = computed<Task[]>(() =>
    tasks.value.filter((t) => t.project?.id === projectStore.currentProjectId)
  );

  async function fetchTasks(projectId: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await tasksApi.getByProject(projectId);
      const tasksData = response.data || [];

      tasks.value = (Array.isArray(tasksData) ? tasksData : []).map(
        (task: any) => ({
          ...task,
          project: task.project || { id: projectId },
        })
      );
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to fetch tasks";
    } finally {
      loading.value = false;
    }
  }

  async function createTask(
    projectId: string,
    payload: CreateTaskPayload
  ): Promise<Task> {
    try {
      const response = await tasksApi.create(projectId, payload);
      const responseData = response.data || response;

      const newTask: Task = {
        id: responseData.id || "",
        projectId: projectId,
        title: responseData.title || payload.title || "",
        description: responseData.description || payload.description || "",
        status: responseData.status || "в процессе",
        priority: responseData.priority || "medium",
        dueDate: responseData.dueDate || null,
        tags: responseData.tags || [],
        sectionId: responseData.sectionId || payload.sectionId || null,
        createdAt: responseData.createdAt || new Date().toISOString(),
        updatedAt: responseData.updatedAt || new Date().toISOString(),

        project: responseData.project || { id: projectId },
      } as Task;

      console.log("✅ New task created:", newTask);

      tasks.value.unshift(newTask);

      const sectionStore = useSectionStore();
      if (newTask.sectionId) {
        const targetSection = sectionStore.projectSections.find(
          (s) => s.id === newTask.sectionId
        );
        if (targetSection) {
          if (!targetSection.tasks) targetSection.tasks = [];
          targetSection.tasks.unshift(newTask);
        }
      }

      return newTask;
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to create task";
      throw err;
    }
  }

  async function updateTask(
    projectId: string,
    taskId: string,
    payload: any
  ): Promise<Task> {
    try {
      let currentTask = tasks.value.find((t) => t.id === taskId);

      if (!currentTask) {
        const sectionStore = useSectionStore();
        for (const section of sectionStore.projectSections) {
          if (section.tasks) {
            const found = section.tasks.find((t) => t.id === taskId);
            if (found) {
              currentTask = found;
              break;
            }
          }
        }
      }

      if (!currentTask) {
        throw new Error("Task not found");
      }

      const fullPayload = {
        title: payload.title ?? currentTask.title,
        description: payload.description ?? currentTask.description,
        status: payload.status ?? currentTask.status,
        priority: payload.priority ?? currentTask.priority,
        dueDate: payload.dueDate ?? currentTask.dueDate,
        tags: payload.tags ?? currentTask.tags,
        sectionId: payload.sectionId ?? currentTask.sectionId,
      };

      console.log("📤 Sending full payload:", {
        projectId,
        taskId,
        fullPayload,
      });

      const response = await tasksApi.update(projectId, taskId, fullPayload);
      const responseData = response.data || response;

      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = {
          ...tasks.value[index],
          ...responseData,
        };
      }

      const sectionStore = useSectionStore();
      for (const section of sectionStore.projectSections) {
        if (section.tasks) {
          const taskIndex = section.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            section.tasks[taskIndex] = {
              ...section.tasks[taskIndex],
              ...responseData,
            };
          }
        }
      }

      console.log("✅ Task updated:", responseData);
      return responseData;
    } catch (err: any) {
      console.error("❌ Error response:", err.response?.data);
      error.value = err.response?.data?.message || "Failed to update task";
      throw err;
    }
  }

  async function deleteTask(projectId: string, taskId: string): Promise<void> {
    try {
      await tasksApi.delete(projectId, taskId);

      tasks.value = tasks.value.filter((t) => t.id !== taskId);

      const sectionStore = useSectionStore();
      for (const section of sectionStore.projectSections) {
        if (section.tasks) {
          section.tasks = section.tasks.filter((t) => t.id !== taskId);
        }
      }

      console.log("✅ Task deleted");
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to delete task";
      throw err;
    }
  }

  async function moveTaskToSection(
    projectId: string,
    taskId: string,
    toSectionId: string
  ): Promise<void> {
    try {
      const response = await tasksApi.moveToSection(
        projectId,
        taskId,
        toSectionId
      );

      const sectionStore = useSectionStore();

      let taskToMove: Task | undefined;
      let fromSectionId: string | undefined;

      for (const section of sectionStore.projectSections) {
        if (section.tasks) {
          const taskIndex = section.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = section.tasks[taskIndex];
            fromSectionId = section.id;
            break;
          }
        }
      }

      if (!taskToMove) {
        throw new Error("Task not found");
      }

      if (fromSectionId === toSectionId) {
        return;
      }

      taskToMove.sectionId = toSectionId;

      if (fromSectionId) {
        const fromSection = sectionStore.projectSections.find(
          (s) => s.id === fromSectionId
        );
        if (fromSection && fromSection.tasks) {
          fromSection.tasks = fromSection.tasks.filter((t) => t.id !== taskId);
        }
      }

      const toSection = sectionStore.projectSections.find(
        (s) => s.id === toSectionId
      );
      if (toSection) {
        if (!toSection.tasks) toSection.tasks = [];
        toSection.tasks.push(taskToMove);
      }

      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index].sectionId = toSectionId;
      }

      console.log("✅ Task moved from", fromSectionId, "to", toSectionId);
    } catch (err) {
      error.value =
        (err as any).response?.data?.message || "Failed to move task";
      console.error("❌ Move error:", err);
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    projectTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTaskToSection,
  };
});
