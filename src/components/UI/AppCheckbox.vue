<template>
  <div
    @click="emit('update:modelValue', !props.modelValue)"
    class="checkbox"
    :class="{'checkbox--checked': props.modelValue}"
  >
    <AppIcon v-if="props.modelValue" :color="Colors.GRAY_000" icon-name="check"></AppIcon>
  </div>
</template>

<script lang="ts" setup>
import AppIcon from '@/components/UI/AppIcon.vue'
import { Colors } from '@/lib/UI/colors'

interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped lang="scss">
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  cursor: pointer;
  border: 2px solid $gray-300;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    border-color: $accent-main;
  }

  &--checked {
    background-color: $accent-main;
    border-color: $accent-main;

    &:hover {
      background-color: $accent-hover;
      border-color: $accent-hover;
    }
  }
}
</style>
