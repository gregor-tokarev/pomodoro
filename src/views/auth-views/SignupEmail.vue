<template>
  <div class="auth signup-email">
    <h1 class="bold-title-text auth__title">
      Signup
      <router-link to="/auth/login/email" class="subtitle-text link link--underlined">Login</router-link>
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
          <span class="basic-text signup-email__password-rules">8+ letters, a list one number</span>
        </fieldset>
        <fieldset class="signup-email__field">
          <div class="subtitle-text signup-email__label"
               :class="{'signup-email__label--error': $v.passwordRepeat.$error}">Repeat password
          </div>
          <AppInput type="password" :error="$v.passwordRepeat.$error" v-model="form.passwordRepeat"
                    placeholder="st%ro3ng password"></AppInput>
        </fieldset>

        <div class="basic-text signup-email__errors">
          <p v-if="emailExistsError">This email is already in use</p>
        </div>

        <AppButton>Signup</AppButton>
      </fieldset>
    </form>

    <img class="signup-email__illustration" src="@/assets/images/signup-illustration.svg" alt="">

    <div class="basic-text auth__terms">By register you agree with our
      <router-link to="/auth/terms" class="link">terms and conditions</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppInput from '@/components/UI/AppInput.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { ref } from 'vue'
import { email, minLength, required } from '@vuelidate/validators'
import { auth } from '@/lib/firebase'
import { useStore } from 'vuex'
import { sameAsField } from '@/lib/custom-validarots'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { IUser } from '../../../models/user.model'

const store = useStore()
const router = useRouter()

interface Form {
  email: string;
  password: string;
  passwordRepeat: string;
}

const form = ref<Form>({
  email: '',
  password: '',
  passwordRepeat: ''
})

const $v = useVuelidate({
  email: {
    required,
    email
  },
  password: {
    required,
    minLength: minLength(8)
  },
  passwordRepeat: {
    required,
    sameAsPassword: sameAsField('password')
  }
}, form)

const emailExistsError = ref<boolean>(false)

async function submit(): Promise<void> {
  $v.value.$touch()
  if ($v.value.$error) {
    return
  }

  try {
    await auth.createUserWithEmailAndPassword(form.value.email, form.value.password)

    emailExistsError.value = false

    const user: IUser = await store.dispatch('authModule/createUser', auth.currentUser)

    router.push({
      name: 'auth-verify-email',
      query: { email: user.email }
    })
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      emailExistsError.value = true
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

  &__password-rules {
    color: $gray-300;
  }

  &__illustration {
    position: absolute;
    right: 8%;
    bottom: 205px;
  }
}
</style>
