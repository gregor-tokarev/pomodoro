<template>
  <input
    type="text"
    class="input button-text"
    @input="emit('update:modelValue', $event.currentTarget.value)"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :class="{
      'input--error': props.error
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
  display: flex;
  align-items: center;
  height: 60px;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: $gray-100;
  padding: 0 15px;
  color: $gray-400;
  outline: none;

  &::placeholder {
    color: $system-placeholder;
  }

  &--error {
    border-color: $system-error;
    color: $system-error;
  }
}
</style>
