<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="shrink-0 h-14 flex items-center px-4 border-b border-gray-300">
      <slot name="header" />
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Resizable Sidebar -->
      <div
        ref="sidebar"
        class="h-full w-45 bg-lighter-blue border-r border-gray-300 overflow-auto relative p-4"
      >
        <slot name="sidebar" />
      </div>

      <!-- Main Area -->
      <main class="flex-1 overflow-y-scroll p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
/* Optional cursor feedback */
</style>
