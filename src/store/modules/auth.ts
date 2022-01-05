import { User, provider } from '../../../models/user.model'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { auth, firestore } from '@/lib/firebase'
import firebase from 'firebase/compat'
import { nanoid } from 'nanoid'
import { getUserSettings } from '../../../models/settings/get-user-settings.default'

export interface AuthState {
  user: User | null,
}

const state: AuthState = {
  user: null
}

const mutations: MutationTree<AuthState> = {
  SET_USER(state, user: User): void {
    state.user = user
  },
  REMOVE_USER(state): void {
    state.user = null
  }
}

const actions: ActionTree<AuthState, RootState> = {
  async fetchUserProfile({
    commit,
    getters
  }) {
    const userId = getters.userId

    try {
      const userRef = firestore.collection('users').doc(userId)
      const document = await userRef.get()
      if (!document.exists) {
        return
      }

      const user = { id: document.id, ...document.data() } as User

      localStorage.setItem('userId', user.id)
      commit('SET_USER', user)
      return user
    } catch (err) {
      console.error(err)
    }
  },
  async createUser({ commit }, userData: firebase.User) {
    try {
      const user: Omit<User, 'id'> = {
        email: userData.email!,
        username: userData.displayName ?? '',
        emailVerified: process.env.NODE_ENV === 'production' ? userData.emailVerified : true,
        avatar: userData.photoURL ?? '',
        provider: userData.providerData[0]!.providerId as provider
      }
      localStorage.setItem('userId', userData.uid)

      const userRef = firestore.collection('users').doc(userData.uid)
      await userRef.set(user)

      const settingsId = nanoid()
      const userSettings = getUserSettings({
        ownerId: userData.uid
      })
      await userRef.collection('settings').doc(settingsId).set(userSettings)

      commit('SET_USER', user)
      return user
    } catch (err) {
      console.error(err)
    }
  },
  async logout({ commit }) {
    try {
      await auth.signOut()
      localStorage.removeItem('userId')
      commit('REMOVE_USER')
    } catch (err) {
      console.error(err)
    }
  }
}

const getters: GetterTree<AuthState, RootState> = {
  getUser(state): User | null {
    return state.user
  },
  userId(state): string | null {
    return state.user?.id ?? localStorage.getItem('userId')
  },
  isAuthorized(state): boolean {
    return !!state.user?.emailVerified
  }
}

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
