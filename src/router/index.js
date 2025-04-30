import { createRouter, createWebHistory } from 'vue-router';
import TestDesign from '@/views/TestDesign.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TestDesign',
      component: TestDesign,
    },
  ],
});

export default router;
