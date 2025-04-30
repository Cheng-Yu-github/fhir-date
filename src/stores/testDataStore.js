import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTestDataStore = defineStore('testData', () => {
  const testData = ref([]);
  const activeType = ref(null);

  async function load(type) {
    try {
      const module = await import(`@/assets/${type}.json`);
      testData.value = Array.isArray(module.default) ? module.default : [module.default];
      activeType.value = type;
    } catch (err) {
      console.error(`Failed to load ${type}.json`, err);
      testData.value = [];
      activeType.value = null;
    }
  }

  function clear() {
    testData.value = [];
    activeType.value = null;
  }

  return { testData, activeType, load, clear };
});
