import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { autosize } from '@/directives/autosize'
import { clickOutside } from '@/directives/clickOutside'

import '@/assets/scss/global.scss'

const app = createApp(App)
  .use(store)
  .use(router)
  .directive('autosize', autosize)
  .directive('clickOutside', clickOutside)

router.isReady().then(() => {
  app.mount('#app')
})
