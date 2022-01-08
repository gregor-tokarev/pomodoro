<template>
  <div
    class="select"
    :class="{'select--disabled': props.disabled}"
    v-click-outside="onClickOutside"
  >
    <div
      @click.stop="toggleOpenState"
      class="base-field button-text select__body"
      :class="{'select__body--placeholder': !props.modelValue}"
    >
      {{ props.modelValue || props.placeholder }}
      <AppIcon
        class="select__arrow"
        :class="{'select__arrow--rotated': isOpen}"
        :color="props.disabled ? Colors.SYSTEM_DISABLED : Colors.GRAY_400"
        icon-name="arrow-down"
      ></AppIcon>
    </div>
    <ul v-if="isOpen" class="button-text select__options">
      <li
        v-for="(option, index) in props.options"
        :key="index"
        class="select__option"
        :class="{'select__option--active': option === props.modelValue}"

        @click.stop="emitValue(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Colors } from '@/lib/UI/colors'
import AppIcon from '@/components/UI/AppIcon.vue'
import { ref, toRef, watch } from 'vue'

interface Props {
  placeholder: string
  modelValue: string
  options: string[]
  error: boolean
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  modelValue: '',
  error: false,
  disabled: false
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const isOpen = ref<boolean>(false)

watch(toRef(props, 'disabled'), value => {
  if (value) {
    isOpen.value = false
  }
})

function toggleOpenState(value: boolean): void {
  if (props.disabled) {
    return
  }

  isOpen.value = value ?? !isOpen.value
}

function onClickOutside() {
  isOpen.value = false
}

function emitValue(option: string): void {
  emit('update:modelValue', option)
  isOpen.value = false
}
</script>

<style scoped lang="scss">
$padding-x: 13px;

.select {
  position: relative;

  &--disabled {
    .select__body {
      cursor: not-allowed;
      color: $system-disabled;
    }
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-x 20px;
    cursor: pointer;

    &--placeholder {
      color: $system-placeholder;
    }
  }

  &__arrow {
    transition: transform 0.2s;

    &--rotated {
      transform: rotate(180deg);
    }
  }

  &__options {
    position: absolute;
    z-index: 3;
    top: calc(100% - 15px);
    width: 100%;
    padding: 20px 0;
    background-color: $gray-100;
    border-radius: 0 0 20px 20px;
  }

  &__option {
    padding: 4px 20px;
    color: $gray-400;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover,
    &--active {
      background-color: $gray-200;
    }
  }
}
</style>
