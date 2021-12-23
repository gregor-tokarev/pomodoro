import { RouteRecordRaw } from 'vue-router'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/app/timer'
  },
  {
    path: 'timer',
    name: 'app-timer',
    component: () => import(/* webpackChunkName: "timer-view" */ '@/views/app-views/Timer.vue')
  },
  {
    path: 'todo',
    name: 'app-todo',
    component: () => import(/* webpackChunkName: "tasks-view" */ '@/views/app-views/Todo.vue')
  },
  {
    path: 'history',
    name: 'app-history',
    component: () => import(/* webpackChunkName: "history-view" */ '@/views/app-views/History.vue')
  },
  {
    path: 'settings',
    name: 'app-settings',
    component: () => import(/* webpackChunkName: "settings-view" */ '@/views/app-views/Settings.vue')
  }
]
