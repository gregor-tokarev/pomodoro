<template>
  <div class="auth terms">
    <AppBack class="auth__back" @click="router.back"></AppBack>
    <div class="terms__body">
      <h1 class="title-text terms__title">Terms and conditions</h1>

      <ul class="terms__list">
        <li class="terms__group">
          <h4 class="subtitle-text terms__point">1.1 Some point</h4>
          <p class="basic-text terms__desc">Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum
            dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.
            Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit
            dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute
            id deserunt nisi.</p>
        </li>
        <li class="terms__group">
          <h4 class="subtitle-text terms__point">1.2 Some point</h4>
          <p class="basic-text terms__desc">Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum
            dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.
            Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit
            dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute
            id deserunt nisi.</p>
        </li>
        <li class="terms__group">
          <h4 class="subtitle-text terms__point">1.3 Some point</h4>
          <p class="basic-text terms__desc">Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum
            dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.
            Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit
            dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute
            id deserunt nisi.</p>
        </li>
        <li class="terms__group">
          <h4 class="subtitle-text terms__point">1.4 Some point</h4>
          <p class="basic-text terms__desc">Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum
            dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.
            Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit
            dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute
            id deserunt nisi.</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppBack from '@/components/UI/AppBack.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped lang="scss">
.terms {
  position: relative;
  padding: 0;

  &__body {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 700px;
    padding: 20px 30px;
    background-color: $gray-000;
    border-radius: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    transform: translate(-50%, -50%);
  }

  &__title {
    color: $gray-400;
    text-align: center;
  }

  &__list {
    max-height: 430px;
    margin-top: 30px;
    overflow-y: auto;
  }

  &__group {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  &__point {
    margin-bottom: 5px;
    color: $gray-400;
  }

  &__desc {
    color: $gray-300;
  }
}
</style>
