<template>
  <div class="auth verify-email">
    <h1 class="bold-title-text auth__title">Verify your email</h1>

    <p class="basic-text verify-email__text">
      An email has been sent to {{ email }} with a link to verify your account. If you have not recived the
      email
      after a few minutes, please check your spam folder
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const email = route.query.email as string
</script>

<style scoped lang="scss">
.verify-email {
  &__text {
    max-width: 635px;
    margin-top: 40px;
    color: $gray-400;
  }
}
</style>
