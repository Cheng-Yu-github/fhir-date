<script setup>
import { computed } from 'vue';
import { extractDateRange, getImplicitRangeFromDateTime } from '@/utils/dateHelpers';

const props = defineProps({
  testData: Array,
  searchParams: Array,
  dateField: String,
});

function searchParamToRange(value) {
  const prefix = value.slice(0, 2).match(/(ge|gt|le|lt|eq)/) ? value.slice(0, 2) : 'eq';
  const dateStr = prefix === 'eq' ? value : value.slice(2);
  const [implicitStart, implicitEnd] = getImplicitRangeFromDateTime(dateStr);

  switch (prefix) {
    case 'ge':
      return [implicitStart, null];
    case 'gt':
      return [new Date(implicitEnd), null];
    case 'le':
      return [null, implicitEnd];
    case 'lt':
      return [null, new Date(implicitStart)];
    default:
      return [implicitStart, implicitEnd];
  }
}

const resourceRanges = computed(() => {
  const candidateFields = Array.isArray(props.dateField) ? props.dateField : [props.dateField];

  return props.testData.map((item, index) => {
    let start = null;
    let end = null;

    for (const path of candidateFields) {
      const [s, e] = extractDateRange(item, path);
      if (s || e) {
        start = s;
        end = e;
        break;
      }
    }

    return { label: `Resource #${index + 1}`, start, end };
  });
});

const searchRanges = computed(() => {
  return props.searchParams.map((p) => {
    const [start, end] = searchParamToRange(p.value);
    return { label: `${p.param}=${p.value}`, start, end };
  });
});

const timeBounds = computed(() => {
  const firstSearch = searchRanges.value[0];
  if (!firstSearch) return { min: null, max: null };

  const start = firstSearch.start;
  const end = firstSearch.end;

  if (!start || !end) return { min: start || end, max: end || start };

  const spanMs = end - start;
  const buffer = spanMs * 0.1;

  return {
    min: new Date(start.getTime() - buffer),
    max: new Date(end.getTime() + buffer),
  };
});

function toPercent(date) {
  if (!date) return 0;
  const { min, max } = timeBounds.value;
  if (!min || !max) return 0;

  // Clamp to limits
  if (date <= min) return 0;
  if (date >= max) return 100;

  return ((date - min) / (max - min)) * 100;
}
</script>

<template>
  <div class="mb-4">
    <div class="space-y-6">
      <div v-for="(search, i) in searchRanges" :key="i" class="border p-4 rounded">
        <p class="font-medium mb-2 text-blue-800">Search Parameter: {{ search.label }}</p>
        <!-- Search range -->
        <div class="relative h-6 bg-blue-100 rounded overflow-hidden mb-2">
          <div
            v-if="search.start && search.end"
            class="absolute top-0 bottom-0 bg-blue-500 opacity-60"
            :style="{
              left: toPercent(search.start) + '%',
              width: toPercent(search.end) - toPercent(search.start) + '%',
            }"
          ></div>
          <div
            v-else-if="search.start"
            class="absolute top-0 bottom-0 bg-blue-500 opacity-60"
            :style="{
              left: toPercent(search.start) + '%',
              width: 100 - toPercent(search.start) + '%',
            }"
          ></div>
          <div
            v-else-if="search.end"
            class="absolute top-0 bottom-0 bg-blue-500 opacity-60"
            :style="{ left: 0, width: toPercent(search.end) + '%' }"
          ></div>
          <span class="absolute text-sm left-1">Search range</span>
        </div>

        <!-- Resource bars -->
        <div
          v-for="(row, j) in resourceRanges"
          :key="j"
          class="relative h-6 bg-gray-100 rounded mb-2"
        >
          <!-- Full range -->
          <div
            v-if="row.start && row.end"
            class="absolute top-0 bottom-0 bg-green-400 opacity-60"
            :style="{
              left: toPercent(row.start) + '%',
              width: Math.max(toPercent(row.end) - toPercent(row.start), 0.5) + '%',
            }"
          ></div>

          <!-- Only start (open-ended) -->
          <div
            v-else-if="row.start"
            class="absolute top-0 bottom-0 bg-green-400 opacity-60"
            :style="{
              left: toPercent(row.start) + '%',
              width: 100 - toPercent(row.start) + '%',
            }"
            title="Missing end date"
          ></div>

          <!-- Only end (open-start) -->
          <div
            v-else-if="row.end"
            class="absolute top-0 bottom-0 bg-green-400 opacity-60"
            :style="{
              left: '0%',
              width: toPercent(row.end) + '%',
            }"
            title="Missing start date"
          ></div>

          <!-- Label (always shown on the left) -->
          <span class="absolute text-sm left-1 text-gray-800">
            {{ row.label }}{{ row.start ? '' : ' «' }}{{ row.end ? '' : ' »' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
