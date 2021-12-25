<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"

    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    :css="false"
  >
    <slot></slot>
  </transition>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap'

interface Props {
  duration: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 0.2
})

// ENTERING
function beforeEnter(el: HTMLElement) {
  el.style.overflowY = 'hidden'
}

function enter(el: HTMLElement, done: () => void) {
  const animation = gsap.fromTo(el, {
    height: 0
  }, {
    height: el.offsetHeight,
    duration: props.duration
  })

  animation.eventCallback('onComplete', done)
}

function afterEnter(el: HTMLElement) {
  el.style.removeProperty('overflow')
}

// LEAVING
function beforeLeave(el: HTMLElement) {
  el.style.overflowY = 'hidden'
}

function leave(el: HTMLElement, done: () => void) {
  const animation = gsap.to(el, {
    height: 0,
    duration: props.duration
  })

  animation.eventCallback('onComplete', done)
}

function afterLeave(el: HTMLElement) {
  el.style.removeProperty('overflow')
  el.style.display = 'none'
}
</script>

<style scoped lang="scss">

</style>
