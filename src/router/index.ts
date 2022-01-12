import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import App from '@/views/app-views/AppLayout.vue'
import { appRoutes } from '@/router/app-routes'
import { authRoutes } from '@/router/auth-routes'

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/about',
  //   name: 'About',
  //   route level code-splitting
  //   this generates a separate chunk (about.[hash].js) for this route
  //   which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  // {
  //   path: '/uikit',
  //   name: 'uikit',
  //   component: () => import('@/views/UIKit.vue')
  // },
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
