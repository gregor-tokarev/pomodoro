<template>
  <div class="loader">
    <AppIcon class="loader__icon" icon-name="loader" :color="Colors.ACCENT_MAIN"></AppIcon>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/UI/AppIcon.vue'
import { Colors } from '@/lib/UI/colors'
</script>

<style scoped lang="scss">
.loader {
  animation: spin 2s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
