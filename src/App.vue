<script setup>
import HeaderFooterLayout from '@/layout/HeaderFooterLayout.vue';
</script>

<template>
  <HeaderFooterLayout>
    <template #header>
      <div class="flex items-center justify-between w-full gap-4">
        <!-- Left: Logo + Title -->
        <div class="flex items-center gap-4">
          <img src="@/assets/Firely_Blue-Yellow.svg" alt="Logo" class="h-6 w-auto" />
          <h1 class="text-lg font-semibold">FHIR date</h1>
        </div>
      </div>
    </template>

    <template #sidebar>
      <div>
        <p>I'm sidebar</p>
      </div>
    </template>

    <template #footer>
      <div>
        <p>I'm footer</p>
      </div>
    </template>

    <!-- Main chart area (default slot) -->
    <div>
      <router-view />
    </div>
  </HeaderFooterLayout>
</template>

<style scoped></style>
