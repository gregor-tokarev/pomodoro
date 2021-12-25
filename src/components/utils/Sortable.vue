<template>
  <ul ref="root">
    <slot></slot>
  </ul>
</template>

<script lang="ts" setup>
import { Sortable, Plugins, SortableStopEvent, SortableStartEvent } from '@shopify/draggable'
import { onMounted, ref } from 'vue'

interface Props {
  handleSelector: string
  draggedElement: string
}

const props = withDefaults(defineProps<Props>(), {
  handleSelector: 'li',
  draggedElement: 'li'
})

const root = ref<HTMLElement>()
const emit = defineEmits<{
  (e: 'dragStart', value: SortableStartEvent): void
  (e: 'dragEnd', value: SortableStopEvent): void
}>()

onMounted(() => {
  const sortable = new Sortable(root.value, {
    draggable: props.draggedElement,
    handle: props.handleSelector,
    plugins: [Plugins.SwapAnimation],
    sortAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out'
    },
    mirror: {
      xAxis: false,
      cursorOffsetX: 5,
      constrainDimensions: true
    }
  })
  sortable.on('sortable:stop', (event: SortableStopEvent) => emit('dragEnd', event))
  sortable.on('sortable:start', (event: SortableStartEvent) => emit('dragStart', event))
})
</script>

<style scoped lang="scss">

</style>
