<template>
  <div class="leftbar">
    <div class="leftbar__logo">
      <img src="@/assets/images/logo.svg" alt="">

      <div class="">
        <h1 class="title-text leftbar__app-name">Pomodoro</h1>
        <h3 class="basic-text leftbar__app-slogan">success tracker</h3>
      </div>
    </div>

    <nav class="leftbar__nav">
      <router-link v-for="(item, index) in navItems" :to="item.path" :key="index">
        <NavItem :is-active="deepPathCheck(route, item.path)" :nav-item="item">
          <template #right>
            <span v-if="index === 0 && currentTime"
                  class="basic-text leftbar__timer">
              {{ currentTime }}
            </span>
          </template>
        </NavItem>
      </router-link>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import NavItem from '@/components/layout/NavItem.vue'
import { deepPathCheck } from '@/lib/routeChecks'
import { Nav } from '../../../models/nav-item.model'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'

const { t } = useI18n()
const store = useStore()
const route = useRoute()

const navItems: Nav[] = [
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
  }
]

const currentTime = computed<string>(() => store.getters['timerModule/timeFormatted'])
</script>

<style scoped lang="scss">
.leftbar {
  padding: 35px 20px;
  background-color: $gray-000;
  border-radius: 30px;

  &__logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    color: $gray-400;
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
