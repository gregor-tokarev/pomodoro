<template>
  <button
    class="button button-text"
    :class="{
      'button--disabled': props.disabled,
      'button--common': props.styleType === 'common',
      'button--light': props.styleType === 'light',
      'button--ghost': props.styleType === 'ghost'
    }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
interface Props {
  disabled: boolean,
  styleType: 'common' | 'light' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  styleType: 'common'
})
</script>

<style scoped lang="scss">
.button {
  cursor: pointer;
  padding: 15px 35px;
  min-width: 150px;
  border-radius: 10px;
  transition: all 0.2s;
  outline: none;
  border: none;
  line-height: 1;

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
