<template>
  <div class="icon" v-html="svg"></div>
</template>

<script lang="ts" setup>
import { Colors } from '@/lib/UI/colors'

interface Props {
  iconName: string;
  color: Colors;
}

const props = withDefaults(defineProps<Props>(), {
  iconName: undefined,
  color: Colors.GRAY_400
})

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-webpack-loader-syntax
const svg = require(`@/assets/icons/${props.iconName}.svg`)
  .default
  .replace('export default ', '')
  .replaceAll('\\n', '')
  .replaceAll('\\', '')
  .replace('"<', '<')
  .replace('>";', '>')
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(path) {
    fill: v-bind("props.color");
  }
}
</style>
