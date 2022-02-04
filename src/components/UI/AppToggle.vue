<template>
  <div
    @click="emit('update:modelValue', !props.modelValue)"
    :class="{'toggle--on': props.modelValue}"
    class="toggle"
  >
    <div class="toggle__bar"></div>
    <div class="toggle__point">
      <AppIcon class="toggle__icon" v-if="props.modelValue" icon-name="check" :color="Colors.GRAY_000"></AppIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Colors } from '@/lib/UI/colors'
import AppIcon from '@/components/UI/AppIcon.vue'

interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const emit = defineEmits<Emits>()
</script>

<style scoped lang="scss">
.toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 72px;
  cursor: pointer;

  &--on {
    .toggle__bar {
      background-color: $accent-hover;
    }

    .toggle__point {
      transform: translateX(37px);
      background-color: $accent-main;
    }
  }

  &__bar {
    width: 55px;
    height: 8px;
    background-color: $gray-300;
    border-radius: 22px;
    transition: background-color 0.2s;
  }

  &__point {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: $gray-100;
    transition: all 0.2s;
  }
}
</style>
