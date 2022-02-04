<template>
  <div ref="timer" class="timer" :class="{'timer--break': props.isBreak}">
    <div class="timer-number-text timer__numbers">{{ props.time }}</div>

    <div class="timer__waves">
      <div ref="wave" class="timer__wave"></div>
      <div class="timer__wave"></div>

      <div class="timer__lift"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  time: string;
  progressPercent: number
  isBreak: boolean
}

const props = defineProps<Props>()

const wave = ref<HTMLElement>()
const timer = ref<HTMLElement>()

const liftHeight = computed<string>(() => {
  if (!wave.value || !timer.value) {
    return '0px'
  }

  const waveHeight = wave.value.offsetHeight
  const timerHeight = timer.value.offsetHeight

  const availableLiftHeight = timerHeight - waveHeight
  return (availableLiftHeight * (props.progressPercent / 100)).toFixed(1) + 'px'
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
  background-color: $gray-100;
  border-radius: 50%;

  &--break {
    .timer__lift {
      background-color: $gray-300;
    }

    .timer__wave {
      background-image: url("~@/assets/images/wave1-break.svg");

      &:nth-child(2) {
        background-image: url("~@/assets/images/wave2-break.svg");
      }
    }
  }

  &__numbers {
    position: relative;
    z-index: 20;
    color: $gray-400;
    mix-blend-mode: luminosity;
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
    z-index: 2;
    display: block;
    height: v-bind('liftHeight');
    content: "";
    background-color: $accent-main;
    transition: height 0.2s;
  }

  &__wave {
    position: absolute;
    z-index: 2;
    width: 3600px;
    height: $wave-height;
    background: url("~@/assets/images/wave1.svg") repeat-x bottom / 300px $wave-height;
    animation: wave 14s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;

    &:nth-child(2) {
      z-index: 1;
      //opacity: 0.2;
      background-image: url("~@/assets/images/wave2.svg");
      animation: wave 14s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.525s infinite, swell 5s ease -1.25s infinite;
    }
  }

  &__wave {
    bottom: v-bind('liftHeight');
    transition: bottom 0.2s;
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
  0%,
  100% {
    transform: translateY(-10px);
  }

  50% {
    transform: translateY(2px);
  }
}
</style>
