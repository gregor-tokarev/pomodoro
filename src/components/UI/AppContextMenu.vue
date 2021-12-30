<template>
  <div v-show="props.modelValue" ref="root" v-click-outside="clickOutside" class="context-menu">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  modelValue: boolean
  containerSelector: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  containerSelector: 'body'
})
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const root = ref<HTMLElement>()
const parent = computed<HTMLElement | null | undefined>(() => root.value?.parentElement)
const container = computed<Element | null>(() => document.querySelector(props.containerSelector))

onMounted(() => {
  parent.value!.addEventListener('contextmenu', contextMenuHandler)
})

onUnmounted(() => {
  parent.value!.removeEventListener('contextmenu', contextMenuHandler)
})

function getCoords(event: MouseEvent): { x: number, y: number } | never {
  if (!container.value || !root.value || !parent.value) {
    throw new Error('Dom is not initialized')
  }

  let x: number
  let y: number

  const menuWidth = root.value?.offsetWidth
  const menuHeight = root.value?.offsetHeight
  const {
    left: containerLeft,
    top: containerTop,
    width: containerWidth,
    height: containerHeight
  } = container.value.getBoundingClientRect()

  const containerX = event.clientX - containerLeft
  const containerY = event.clientY - containerTop

  if (containerWidth > containerX + menuWidth) {
    x = event.clientX - parent.value.getBoundingClientRect().left
  } else {
    x = event.clientX - parent.value.getBoundingClientRect().left - menuWidth
  }
  if (containerHeight > containerY + menuHeight) {
    y = event.clientY - parent.value.getBoundingClientRect().top
  } else {
    y = event.clientY - parent.value.getBoundingClientRect().top - menuHeight
  }

  return {
    x,
    y
  }
}

function contextMenuHandler(event: MouseEvent): void {
  event.preventDefault()
  if (!root.value) {
    return
  }

  const {
    x,
    y
  } = getCoords(event)

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
  border-radius: 10px;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 25%);

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
