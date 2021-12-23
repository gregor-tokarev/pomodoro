<template>
  <input
    type="text"
    class="input base-field button-text"
    @input="emit('update:modelValue', $event.currentTarget.value)"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :class="{
      'base-field--error': props.error
    }"
  >
</template>

<script lang="ts" setup>
interface Props {
  placeholder: string,
  modelValue: string,
  error: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  modelValue: '',
  error: false
})

const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>()
</script>

<style scoped lang="scss">
.input {
  width: 100%;
  height: 60px;
  padding: 0 15px;
}
</style>
