<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-medium text-gray-900">Taskly</h1>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8">
        <slot />
      </div>

      <div class="text-center mt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
