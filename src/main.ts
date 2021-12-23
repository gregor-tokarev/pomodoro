import '@/assets/scss/global.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { clickOutside } from '@/directives/clickOutside'
import { createI18n } from 'vue-i18n'
import { autogrow } from '@/directives/autogrow'

const i18n = createI18n({
  legacy: false
})

const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .directive('autogrow', autogrow)
  .directive('clickOutside', clickOutside)

router.isReady().then(() => {
  app.mount('#app')
})
