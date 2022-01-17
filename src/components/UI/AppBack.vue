<template>
  <div class="back">
    <AppIcon icon-name="arrow-left"></AppIcon>
  </div>
</template>

<script setup lang="ts">

import AppIcon from '@/components/UI/AppIcon.vue'
</script>

<style scoped lang="scss">
$size: 50px;

.back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size;
  height: $size;
  background-color: $gray-100;
  cursor: pointer;
  border-radius: 50%;
}
</style>
