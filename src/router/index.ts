import { createRouter, createWebHistory } from 'vue-router'
import BackPage from '@/views/BackPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BackPage
    }
  ]
})

export default router
