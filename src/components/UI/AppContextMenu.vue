<template>
  <div v-show="props.modelValue" ref="root" v-click-outside="clickOutside" class="context-menu">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const root = ref<HTMLElement>()
const parent = computed<HTMLElement | null | undefined>(() => root.value?.parentElement)

onMounted(() => {
  parent.value!.addEventListener('contextmenu', contextMenuHandler)
})

onUnmounted(() => {
  parent.value!.removeEventListener('contextmenu', contextMenuHandler)
})

function contextMenuHandler(event: MouseEvent): void {
  event.preventDefault()

  const {
    clientX,
    clientY
  } = event
  const {
    left,
    top
  } = parent.value!.getBoundingClientRect()
  const x = clientX - left
  const y = clientY - top

  if (!root.value) {
    return
  }

  root.value.style.top = y + 'px'
  root.value.style.left = x + 'px'
}

function clickOutside(): void {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.context-menu {
  position: absolute;
  z-index: 3;
  min-width: 150px;
  padding: 10px;
  background-color: $gray-000;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  :slotted(&__item) {
    display: flex;
    align-items: center;
    color: $gray-300;
    cursor: pointer;

    .icon {
      margin-right: 5px;
    }

    &:not(:last-child) {
      padding-bottom: 5px;
      margin-bottom: 5px;
      border-bottom: 1px solid $gray-100;
    }
  }

  :slotted(&__item--error) {
    color: $system-error;
  }
}
</style>
