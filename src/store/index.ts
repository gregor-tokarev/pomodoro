import { createStore } from 'vuex'
import { authModule } from '@/store/modules/auth'
import { tasksModule } from '@/store/modules/task'
import { settingsModule } from '@/store/modules/settings'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
}

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    authModule,
    tasksModule,
    settingsModule
  }
})
