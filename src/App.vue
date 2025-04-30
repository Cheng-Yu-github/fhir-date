<script setup>
import HeaderFooterLayout from '@/layout/HeaderFooterLayout.vue';
import { useRouter } from 'vue-router';
import { useTestDataStore } from '@/stores/testDataStore';

const store = useTestDataStore();
const router = useRouter();

function handleLoad(type) {
  store.load(type);
  router.push('/test-data');
}
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
      <nav class="flex flex-col">
        <RouterLink
          to="/"
          class="p-1 hover:bg-blue-300"
          :class="$route.path === '/' ? 'bg-blue-100' : ''"
          @click="store.clear()"
        >
          Test Design
        </RouterLink>

        <RouterLink
          to="/test-data"
          class="p-1 hover:bg-blue-300"
          :class="$route.path === '/test-data' ? 'bg-blue-100' : ''"
        >
          Test Data
        </RouterLink>

        <div class="ml-2 flex flex-col text-sm">
          <button
            v-for="type in ['Patient', 'Observation', 'ServiceRequest']"
            :key="type"
            class="text-left p-1 hover:bg-blue-300"
            :class="store.activeType === type ? 'bg-blue-100' : ''"
            @click="handleLoad(type)"
          >
            {{ type }}
          </button>
        </div>
      </nav>
    </template>

    <!-- Main chart area (default slot) -->
    <div>
      <router-view />
    </div>
  </HeaderFooterLayout>
</template>

<style scoped></style>
