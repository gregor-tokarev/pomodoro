<template>
  <div ref="timer" class="timer">
    <div class="timer-number-text timer__numbers">{{ props.time }}</div>

    <div class="timer__waves">
      <div ref="wave" class="timer__wave"></div>
      <div class="timer__wave"></div>

      <div class="timer__lift"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref, ref } from 'vue'

interface Props {
  time: string;
  coveragePercent: number
}

const props = defineProps<Props>()

const wave = ref<HTMLElement>(null)
const timer = ref<HTMLElement>(null)

const liftHeight = computed<string>(() => {
  const waveHeight = wave.value.offsetHeight
  const timerHeight = timer.value.offsetHeight

  const availableLiftHeight = timerHeight - waveHeight
  return availableLiftHeight * (props.coveragePercent / 100) + 'px'
})
</script>

<style scoped lang="scss">
$wave-height: 50px;

.timer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  overflow: hidden;
  border-radius: 50%;
  background-color: $gray-100;

  &__numbers {
    position: relative;
    z-index: 20;
    mix-blend-mode: luminosity;
    color: $gray-400;
  }

  &__waves {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;

  }

  &__lift {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    content: '';
    height: v-bind(liftHeight);
    display: block;
    background-color: $accent-main;
  }

  &__wave {
    position: absolute;
    bottom: v-bind(liftHeight);
    background: url("~@/assets/images/wave1.svg") repeat-x bottom / 300px $wave-height;
    width: 3600px;
    height: $wave-height;
    animation: wave 14s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;

    &:nth-child(2) {
      opacity: 0.2;
      //animation: wave 18s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
      animation: wave 14s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.525s infinite, swell 5s ease -1.25s infinite;
    }
  }
}

@keyframes wave {
  from {
    margin-left: 0;
  }

  to {
    margin-left: -900px;
  }
}

@keyframes swell {
  0%, 100% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(2px);
  }
}
</style>
