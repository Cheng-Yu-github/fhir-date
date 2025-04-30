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
        :style="{ width: sidebarWidth + 'px' }"
        class="h-full bg-lighter-blue border-r border-gray-300 overflow-auto relative p-4"
      >
        <slot name="sidebar" />

        <!-- Drag handle -->
        <div
          class="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent"
          @mousedown.prevent="startResize"
        />
      </div>

      <!-- Main Area -->
      <main class="flex-1 overflow-y-scroll p-4">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="shrink-0 h-10 flex items-center px-4 border-t border-gray-300">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

const sidebarWidth = ref(240);
let startX = 0;
let startWidth = 0;

const startResize = (e) => {
  startX = e.clientX;
  startWidth = sidebarWidth.value;
  document.addEventListener('mousemove', resizeSidebar);
  document.addEventListener('mouseup', stopResize);
};

const resizeSidebar = (e) => {
  const newWidth = startWidth + (e.clientX - startX);
  sidebarWidth.value = Math.min(Math.max(newWidth, 180), 480);
};

const stopResize = () => {
  document.removeEventListener('mousemove', resizeSidebar);
  document.removeEventListener('mouseup', stopResize);
};

onBeforeUnmount(() => {
  stopResize();
});
</script>

<style scoped>
/* Optional cursor feedback */
</style>
