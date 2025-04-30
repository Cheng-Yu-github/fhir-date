<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Resource (R4)</h1>
    <div class="overflow-auto border rounded-xl">
      <table class="min-w-full text-left table-auto border-collapse">
        <thead class="bg-gray-100 font-semibold">
          <tr>
            <th class="px-4 py-2 border-b">Resource</th>
            <th class="px-4 py-2 border-b">Property</th>
            <th class="px-4 py-2 border-b">Underlying Type</th>
            <th class="px-4 py-2 border-b">Search Parameter</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rowsResource" :key="i" class="even:bg-white odd:bg-gray-50">
            <td class="px-4 py-2 border-b whitespace-pre-wrap">{{ row.resource }}</td>
            <td class="px-4 py-2 border-b whitespace-pre-wrap">{{ row.property }}</td>
            <td class="px-4 py-2 border-b whitespace-pre-wrap">{{ row.underlyingType }}</td>
            <td class="px-4 py-2 border-b whitespace-pre-wrap">{{ row.searchParameter }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const rowsResource = [
  {
    resource: 'Patient',
    property: 'birthDate',
    underlyingType: 'date',
    searchParameter: 'birthdate',
  },
  {
    resource: 'Patient',
    property: 'deceasedDateTime',
    underlyingType: 'dateTime',
    searchParameter: 'death-date',
  },
  {
    resource: 'Observation',
    property: 'issued',
    underlyingType: 'instant',
    searchParameter: 'issued (custom SP)',
  },
  {
    resource: 'Observation',
    property: 'effectiveDateTime',
    underlyingType: 'dateTime',
    searchParameter: 'date',
  },
  {
    resource: 'Observation',
    property: 'effectivePeriod',
    underlyingType: 'Period',
    searchParameter: 'date',
  },
  {
    resource: 'ServiceRequest',
    property: 'occurrenceTiming',
    underlyingType: 'Timing',
    searchParameter: 'occurrence',
  },
];
</script>
