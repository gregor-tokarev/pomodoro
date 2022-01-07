import { UserSettings } from '../../../models/settings/user-settings.model'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { TimerOptions } from '../../../models/settings/timer-options.model'
import { firestore } from '@/lib/firebase'

export interface SettingsState {
  userSettings: UserSettings | null,
  timerOptions: TimerOptions | null
}

const state: SettingsState = {
  userSettings: null,
  timerOptions: {
    break: [
      { time: 5 },
      { time: 15 },
      { time: 30 }
    ],
    work: [
      { time: 25 },
      { time: 45 },
      { time: 60 }
    ]
  }
}

const mutations: MutationTree<SettingsState> = {
  SET_USER_SETTINGS(state, settings: UserSettings) {
    state.userSettings = settings
  }
}

const actions: ActionTree<SettingsState, RootState> = {
  async fetchUser({
    commit,
    rootGetters
  }): Promise<UserSettings> {
    try {
      const userId = rootGetters['authModule/userId']
      const settingsRef = firestore.collectionGroup('settings').where('ownerId', '==', userId)

      const allSettings = await settingsRef.get()
      const settingsData = allSettings.docs[0].data() as UserSettings

      commit('SET_USER_SETTINGS', settingsData)
      return settingsData
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async updateUserSettings({
    commit,
    rootGetters,
    getters
  }, settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const userId = rootGetters['authModule/userId']
      const settingsRef = firestore.collectionGroup('settings').where('ownerId', '==', userId)

      const allSettings = await settingsRef.get()

      await allSettings.docs[0].ref.update(settings)
      const newSettings = {
        ...getters.userSettings,
        ...settings
      }

      commit('SET_USER_SETTINGS', newSettings)
      return newSettings
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

const getters: GetterTree<SettingsState, RootState> = {
  timerOptions(state): TimerOptions | null {
    return state.timerOptions
  },
  userSettings(state): UserSettings | null {
    return state.userSettings
  }
}

export const settingsModule: Module<SettingsState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
