<template>
  <button
    class="button button-text"
    :class="{
      'button--disabled': props.disabled,
      'button--common': props.type === 'common',
      'button--light': props.type === 'light',
      'button--ghost': props.type === 'ghost'
    }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
interface Props {
  disabled: boolean,
  type: 'common' | 'light' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'common'
})
</script>

<style scoped lang="scss">
.button {
  cursor: pointer;
  padding: 15px 35px;
  min-width: 200px;
  border-radius: 10px;
  transition: all 0.2s;
  outline: none;
  border: none;

  &--common {
    background-color: $accent-main;
    color: $gray-000;

    &:hover {
      background-color: $accent-hover;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: $accent-main;
    }
  }

  &--light {
    color: $accent-main;
    background-color: $accent-light;

    &:hover {
      background-color: $accent-light;
      color: $accent-main;
    }
  }

  &--ghost {
    color: $gray-400;
    background-color: transparent;

    &:hover {
      background-color: $gray-100;
    }
  }
}
</style>
