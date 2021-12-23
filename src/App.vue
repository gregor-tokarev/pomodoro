<template>
  <router-view/>
</template>
<script setup lang="ts">
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { isInAppRoute } from '@/assets/ts/routeChecks'

const store = useStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const isLogged = store.getters['authModule/userId']

  if (!isLogged) {
    router.replace({ name: 'auth-login' })
    return
  }
  await store.dispatch('authModule/fetchUserProfile')

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
      next({ name: 'auth-login' })
    } else {
      next()
    }
  } else {
    next()
  }
})
</script>
<style lang="scss">
</style>
