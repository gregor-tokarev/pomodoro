<template>
  <div class="add-button">
    <div class="add-button__plus">
      <AppIcon icon-name="plus"></AppIcon>
    </div>

    <div class="basic-text add-button__text">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppIcon from '@/components/UI/AppIcon.vue'
</script>

<style scoped lang="scss">
.add-button {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    .add-button__text {
      color: $accent-main;
    }

    .add-button__plus {
      background-color: $accent-main;

      :deep(path) {
        fill: $gray-000;
      }
    }
  }

  &__plus {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 5px;
    border-radius: 50%;
    transition: background-color 0.2s;

    :deep(path) {
      fill: $accent-main;
      transition: fill 0.2s;
    }
  }

  &__text {
    color: $gray-400;
    transition: color 0.2s;
  }
}
</style>
