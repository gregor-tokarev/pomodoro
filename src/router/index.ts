import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import App from '@/views/app-views/AppLayout.vue'
import UIkit from '@/views/UIKit.vue'
import { appRoutes } from '@/router/app-routes'
import { authRoutes } from '@/router/auth-routes'

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  {
    path: '',
    redirect: '/app'
  },
  {
    path: '/app',
    name: 'app',
    component: App,
    children: appRoutes
  },
  ...authRoutes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
