<template>
  <div class="leftbar">
    <router-link v-for="(item, index) in navItems" :to="item.path" :key="index">
      <NavItem :nav-item="item"></NavItem>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import NavItem from '@/components/layout/NavItem.vue'
import { INavItem } from '../../../models/nav-item.model'

const navItems: INavItem[] = [
  {
    text: 'Timer',
    isActive: true,
    iconName: 'clock',
    path: '/app/timer'
  },
  {
    text: 'Todo list',
    isActive: false,
    iconName: 'todo',
    path: '/app/todo'
  },
  {
    text: 'History',
    isActive: false,
    iconName: 'history',
    path: '/app/history'
  },
  {
    text: 'Settings',
    isActive: false,
    iconName: 'settings',
    path: '/app/settings'
  }
]
</script>

<style scoped lang="scss">
.leftbar {
  background-color: $gray-000;
  border-radius: 30px;
  padding: 35px 20px;
}
</style>
