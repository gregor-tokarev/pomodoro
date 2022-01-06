<template>
  <router-view/>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { isInAppRoute } from '@/lib/routeChecks'

const store = useStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  store.dispatch('settingsModule/fetchTimer')
  const isLogged = store.getters['authModule/userId']

  if (!isLogged) {
    router.replace({ name: 'auth-login' })
    return
  }
  await store.dispatch('authModule/fetchUserProfile')
  await store.dispatch('settingsModule/fetchUser')

  if (isInAppRoute(route)) {
    const isAuthorized = store.getters['authModule/isAuthorized']

    if (!isAuthorized) {
      router.replace({ name: 'auth-login' })
      return
    }
  }
})

router.beforeEach((to, from, next) => {
  if (isInAppRoute(to)) {
    const isAuthorized = store.getters['authModule/isAuthorized']

    if (!isAuthorized) {
      return next({ name: 'auth-login' })
    }
    return next()
  }

  next()
})
</script>
