import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { autosize } from '@/directives/autosize'
// @ts-ignore
import vClickOutside from 'v-click-outside'

import '@/assets/scss/global.scss'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(vClickOutside)
  .directive('autosize', autosize)

router.isReady().then(() => {
  app.mount('#app')
})
