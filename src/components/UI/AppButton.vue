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
  min-width: 150px;
  padding: 15px 35px;
  line-height: 1;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s;

  &--common {
    color: $gray-000;
    background-color: $accent-main;

    &:hover {
      background-color: $accent-hover;
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;

    &:hover {
      background-color: $accent-main;
    }
  }

  &--light {
    color: $accent-main;
    background-color: $accent-light;

    &:hover {
      color: $accent-main;
      background-color: $accent-light;
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
