<template>
  <div class="auth login-email">
    <h1 class="bold-title-text auth__title">
      Login
      <router-link to="/auth/signup/email" class="subtitle-text link link--underlined">Signup</router-link>
    </h1>

    <form action="" @submit.prevent="submit" class="signup-email__form">
      <fieldset>
        <fieldset class="signup-email__field">
          <div class="subtitle-text signup-email__label" :class="{'signup-email__label--error': $v.email.$error}">
            Email
          </div>
          <AppInput :error="$v.email.$error" v-model="form.email" placeholder="contact@gregortokarev.com"></AppInput>
        </fieldset>
        <fieldset class="signup-email__field">
          <div class="subtitle-text signup-email__label" :class="{'signup-email__label--error': $v.password.$error}">
            Password
          </div>
          <AppInput type="password" :error="$v.password.$error" v-model="form.password"
                    placeholder="st%ro3ng password"></AppInput>
        </fieldset>

        <div class="basic-text signup-email__errors">
          <p v-if="wrongEmailError">Email is not exist</p>
          <p v-if="wrongPasswordError || $v.email.$error">Password is incorrect</p>
        </div>

        <AppButton>Login</AppButton>
      </fieldset>
    </form>

    <img class="signup-email__illustration" src="@/assets/images/signup-illustration.svg" alt="">

    <div class="basic-text auth__terms">By register you agree with our
      <router-link to="/auth/terms" class="link">terms and conditions</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppButton from '@/components/UI/AppButton.vue'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { auth } from '@/assets/ts/firebase'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

interface Form {
  email: string
  password: string
}

const form = ref<Form>({
  email: '',
  password: ''
})

const $v = useVuelidate({
  email: {
    required,
    email
  },
  password: {
    required,
    minLength: minLength(8)
  }
}, form)

const wrongEmailError = ref<boolean>(false)
const wrongPasswordError = ref<boolean>(false)

async function submit(): Promise<void> {
  $v.value.$touch()
  if ($v.value.$error) {
    return
  }

  try {
    const { user } = await auth.signInWithEmailAndPassword(form.value.email, form.value.password)

    wrongEmailError.value = false
    wrongPasswordError.value = false

    localStorage.setItem('userId', user!.uid)
    await store.dispatch('authModule/fetchUserProfile')

    router.push({ name: 'app-timer' })
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      wrongEmailError.value = true
    } else if (err.code === 'auth/wrong-password') {
      wrongPasswordError.value = true
    }
  }
}
</script>

<style scoped lang="scss">
.signup-email {
  &__form {
    max-width: 500px;
    margin-top: 40px;
  }

  &__field {
    margin-bottom: 25px;
  }

  &__label {
    color: $gray-400;
    margin-bottom: 2px;

    &--error {
      color: $system-error;
    }
  }

  &__errors {
    margin-bottom: 25px;
    color: $system-error;
  }

  &__illustration {
    position: absolute;
    right: 8%;
    bottom: 205px;
  }
}
</style>
