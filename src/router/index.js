import { createRouter, createWebHistory } from 'vue-router';
import TestDesign from '@/views/TestDesign.vue';
import TestData from '@/views/TestData.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TestDesign',
      component: TestDesign,
    },
    {
      path: '/test-data',
      name: 'TestData',
      component: TestData,
    },
  ],
});

export default router;
