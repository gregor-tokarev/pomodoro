import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import UIKit from '@/views/UIKit.vue'

import Timer from '@/views/app/Timer.vue'
import Todo from '@/views/app/Todo.vue'
import History from '@/views/app/History.vue'
import Settings from '@/views/app/Settings.vue'

import App from '@/layout/App.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   route level code-splitting
  //   this generates a separate chunk (about.[hash].js) for this route
  //   which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/uikit',
    name: 'uikit',
    component: UIKit
  },
  {
    path: '/app',
    name: 'app',
    component: App,
    children: [
      {
        path: 'timer',
        name: 'app-timer',
        component: Timer
      },
      {
        path: 'todo',
        name: 'app-todo',
        component: Todo
      },
      {
        path: 'history',
        name: 'app-history',
        component: History
      },
      {
        path: 'settings',
        name: 'app-settings',
        component: Settings
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
