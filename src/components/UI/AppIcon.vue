<template>
  <div class="icon" v-html="svg"></div>
</template>

<script lang="ts" setup>
interface Props {
  iconName: string
}

const props = withDefaults(defineProps<Props>(), {
  iconName: undefined
})

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-webpack-loader-syntax
const svg = require(`raw-loader!@/assets/icons/${props.iconName}.svg`)
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
}
</style>
