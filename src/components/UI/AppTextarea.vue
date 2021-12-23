<template>
  <textarea
    v-autogrow
    @keydown.shift.enter.exact="addBreak"
    class="textarea base-field button-text"
    @input="emit('update:modelValue', $event.currentTarget.value)"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :class="{
      'base-field--error': props.error
    }"
  ></textarea>
</template>

<script lang="ts" setup>
interface Props {
  placeholder: string
  modelValue: string
  error: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  modelValue: '',
  error: false
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function addBreak(event: KeyboardEvent): void {
  const target = event.currentTarget as HTMLTextAreaElement

  target.value += '\n'
}
</script>

<style scoped lang="scss">
.textarea {
  resize: none;
  width: 100%;
  outline: none;
  padding: 15px 20px;
}
</style>
