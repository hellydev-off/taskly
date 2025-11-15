<template>
  <div class="flex items-center justify-center">
    <div class="text-center max-w-sm">
      <div>
        <svg
          class="w-40 h-40 mx-auto"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="40"
            y="60"
            width="120"
            height="80"
            rx="8"
            stroke="var(--color-todoist-red-light1)"
            stroke-width="3"
            fill="var(--color-todoist-red-lighter)"
          />

          <rect
            x="40"
            y="45"
            width="50"
            height="20"
            rx="4"
            stroke="var(--color-todoist-red-light1)"
            stroke-width="3"
            fill="var(--color-todoist-red-lighter)"
          />

          <line
            x1="100"
            y1="85"
            x2="100"
            y2="115"
            stroke="var(--color-todoist-red)"
            stroke-width="4"
            stroke-linecap="round"
          />
          <line
            x1="85"
            y1="100"
            x2="115"
            y2="100"
            stroke="var(--color-todoist-red)"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-todoist-textdark mb-3">
        Нет проектов
      </h2>

      <p class="text-todoist-darkgray text-sm leading-relaxed">
        Создайте свой первый проект и начните управлять задачами
      </p>
    </div>
  </div>
</template>

<style scoped>
svg {
  filter: drop-shadow(0 4px 12px rgba(228, 67, 50, 0.1));
}
</style>
