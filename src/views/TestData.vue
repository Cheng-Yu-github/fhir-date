<script setup>
import { useTestDataStore } from '@/stores/testDataStore';
import { computed } from 'vue';
const store = useTestDataStore();

const fields = computed(() => {
  switch (store.activeType) {
    case 'Patient':
      return ['birthDate', 'deceasedDateTime', 'id'];
    case 'Observation':
      return ['issued', 'effectiveDateTime', 'effectivePeriod', 'id'];
    case 'ServiceRequest':
      return ['occurrenceTiming.event', 'occurrenceTiming.repeat.boundsPeriod', 'id'];
    default:
      return [];
  }
});

function formatCell(value) {
  if (Array.isArray(value)) return value.map((v) => JSON.stringify(v)).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return value ?? '';
}

function getDeepValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Test Data {{ store.activeType }}</h2>
    <table v-if="store.testData.length && fields.length" class="w-full border">
      <thead>
        <tr>
          <th class="border px-2 py-1 text-left">#</th>
          <th v-for="field in fields" :key="field" class="border px-2 py-1 text-left">
            {{ field }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in store.testData" :key="i">
          <td class="border px-2 py-1">
            {{ i + 1 }}
          </td>
          <td v-for="field in fields" :key="field" class="border px-2 py-1">
            {{ formatCell(getDeepValue(item, field)) }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-gray-500">No resource type selected yet.</p>
  </div>
</template>
