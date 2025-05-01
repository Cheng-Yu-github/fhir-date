<script setup>
import { useTestDataStore } from '@/stores/testDataStore';
import { ref, watch, computed } from 'vue';
import DateSearchVisualizer from '@/components/DateSearchVisualizer.vue';
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

const fhirUrl = ref('');
const resourceType = ref('');
const searchParams = ref([]);
const errorMessage = ref('');

watch(
  () => store.activeType,
  () => {
    fhirUrl.value = '';
    resourceType.value = '';
    searchParams.value = [];
    errorMessage.value = '';
  },
);

function executeRequest() {
  errorMessage.value = '';

  try {
    const url = new URL(fhirUrl.value, 'http://dummy-base'); // allow relative paths
    const [type] = url.pathname.split('/').filter(Boolean);

    if (type !== store.activeType) {
      errorMessage.value = `Resource type mismatch: requested "${type}", but active type is "${store.activeType}".`;
      resourceType.value = '';
      searchParams.value = [];
      return;
    }

    resourceType.value = type;
    const search = new URLSearchParams(url.search);
    searchParams.value = [];

    for (const [key, value] of search.entries()) {
      searchParams.value.push({ param: key, value });
    }
  } catch (e) {
    errorMessage.value = `Invalid URL: ${fhirUrl.value}`;
    resourceType.value = '';
    searchParams.value = [];
  }
}

function getDateField(param, resourceType) {
  const map = {
    Patient: {
      birthdate: ['birthDate'],
      'death-date': ['deceasedDateTime'],
    },
    Observation: {
      date: ['effectiveDateTime', 'effectivePeriod'],
      issued: ['issued'],
    },
    ServiceRequest: {
      occurrence: ['occurrenceTiming.event', 'occurrenceTiming.repeat.boundsPeriod'],
    },
  };

  const candidates = map?.[resourceType]?.[param.toLowerCase()];
  if (!candidates || !store.testData.length) return null;

  // Check if any field in the candidate list exists in any resource
  const isAnyFieldPresent = store.testData.some((item) =>
    candidates.some(
      (field) => field.split('.').reduce((obj, key) => obj?.[key], item) !== undefined,
    ),
  );

  return isAnyFieldPresent ? candidates : null;
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Test Data {{ store.activeType }}</h2>
    <div v-if="store.testData.length && fields.length">
      <div class="mb-6">
        <label class="block font-medium mb-2">FHIR GET Request:</label>
        <input
          v-model="fhirUrl"
          type="text"
          class="w-full border px-3 py-2 rounded text-sm"
          placeholder="e.g. /Observation?date=ge2023-01-01&date=lt2024-01-01"
        />
        <button
          @click="executeRequest"
          class="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Execute
        </button>

        <!-- Error Message -->
        <p v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</p>

        <!-- Parsed Output -->
        <div v-if="resourceType && !errorMessage" class="mt-4 text-gray-600">
          <p class="mt-1">Resource: {{ resourceType }}</p>
          <p class="mt-1">Search Parameters:</p>
          <ul class="list-disc ml-6">
            <li v-for="(p, i) in searchParams" :key="i">{{ p.param }} = {{ p.value }}</li>
          </ul>
        </div>
      </div>

      <table class="w-full border">
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

      <div class="mt-8">
        <DateSearchVisualizer
          :test-data="store.testData"
          v-for="(search, i) in searchParams"
          :key="i"
          :search-params="[search]"
          :date-field="getDateField(search.param, resourceType)"
        />
      </div>
    </div>
    <p v-else class="text-gray-500">No resource type selected yet.</p>
  </div>
</template>
