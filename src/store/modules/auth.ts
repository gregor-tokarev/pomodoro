import { IUser, provider } from '../../../models/user.model'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { auth, firestore } from '@/assets/ts/firebase'
import firebase from 'firebase/compat'

interface AuthState {
  user: IUser | null,
}

const state: AuthState = {
  user: null
}

const mutations: MutationTree<AuthState> = {
  SET_USER(state, user: IUser): void {
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
      const document = await firestore.collection('users').doc(userId).get()
      if (!document.exists) {
        return
      }

      const user = { id: document.id, ...document.data() } as IUser

      localStorage.setItem('userId', user.id)
      commit('SET_USER', user)
      return user
    } catch (err) {
      console.error(err)
    }
  },
  async createUser({ commit }, userData: firebase.User) {
    try {
      const user: Omit<IUser, 'id'> = {
        email: userData.email!,
        username: userData.displayName ?? '',
        emailVerified: process.env.NODE_ENV === 'production' ? userData.emailVerified : true,
        avatar: userData.photoURL ?? '',
        provider: userData.providerData[0]!.providerId as provider
      }
      localStorage.setItem('userId', userData.uid)

      await firestore.collection('users').doc(userData.uid).set(user)
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
  getUser(state): IUser | null {
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
