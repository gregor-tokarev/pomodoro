<template>
  <div class="leftbar">
    <div class="leftbar__logo">
      <img src="@/assets/images/logo.svg" alt="">

      <div class="">
        <h1 class="title-text leftbar__app-name">Pomodoro</h1>
        <h3 class="basic-text leftbar__app-slogan">super-puper vashe</h3>
      </div>
    </div>

    <nav class="leftbar__nav">
      <router-link v-for="(item, index) in navItems" :to="item.path" :key="index">
        <NavItem :is-active="deepPathCheck(route, item.path)" :nav-item="item"></NavItem>
      </router-link>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import NavItem from '@/components/layout/NavItem.vue'
import { deepPathCheck } from '@/assets/ts/routeChecks'
import { INavItem } from '../../../models/nav-item.model'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const navItems: INavItem[] = [
  {
    name: t('timer'),
    iconName: 'clock',
    path: '/app/timer'
  },
  {
    name: t('todoList'),
    iconName: 'todo',
    path: '/app/todo'
  },
  {
    name: t('history'),
    iconName: 'history',
    path: '/app/history'
  },
  {
    name: t('settings'),
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

  &__logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $gray-400;
    margin-bottom: 40px;
  }
}
</style>

<i18n>
{
  "en": {
    "timer": "Timer",
    "todoList": "Todo List",
    "history": "History",
    "settings": "Settings"
  },
  "ru": {
    "timer": "Таймер",
    "todoList": "Задачи",
    "history": "История",
    "settings": "Настройки"
  }
}
</i18n>
