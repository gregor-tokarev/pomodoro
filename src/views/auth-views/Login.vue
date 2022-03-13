<template>
  <div class="auth login">
    <div class="auth__wrapper">
      <h1 class="bold-title-text auth__title">Create Account</h1>

      <h3 class="subtitle-text login__text">Using...</h3>

      <div class="login__providers">
        <div class="basic-text login__provider" @click="signupOAuth('GoogleAuthProvider')">
          <img src="@/assets/images/logos/google.svg" alt="google">
          google
        </div>
        <div class="basic-text login__provider" @click="signupEmail">
          <img src="@/assets/images/logos/email.svg" alt="email">
          email
        </div>
      </div>

      <img class="login__illustration" src="@/assets/images/login-illustration.svg" alt="">
    </div>

    <div class="basic-text auth__terms">By register you agree with our
      <router-link to="/auth/terms" class="link">terms and conditions</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import firebase from 'firebase/compat'
import { auth } from '@/lib/firebase'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

async function signupOAuth(providerName: 'GoogleAuthProvider'): Promise<void> {
  const provider = new firebase.auth[providerName]()
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    await auth.signInWithPopup(provider)
    await store.dispatch('authModule/createUser', auth.currentUser)

    router.push({ name: 'app-timer' })
  } catch (err) {
    console.error(err)
  }
}

async function signupEmail(): Promise<void> {
  router.push({ name: 'auth-login-email' })
}
</script>

<style scoped lang="scss">
.login {
  color: $gray-400;

  &__text {
    margin: 40px 0 20px;
    color: $gray-400;
  }

  &__providers {
    display: flex;
  }

  &__provider {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 160px;
    height: 160px;
    padding: 35px 0 0;
    cursor: pointer;
    border: 1px solid $gray-200;
    border-radius: 20px;

    &:not(:last-child) {
      margin-right: 15px;
    }

    img {
      margin-bottom: 15px;
    }
  }

  &__illustration {
    position: absolute;
    right: 12.5%;
    bottom: 205px;
  }
}
</style>
