<template>
  <div class="textarea base-field">
    <textarea
      v-autogrow
      rows="1"
      class="button-text textarea__field"
      @input="emit('update:modelValue', $event.currentTarget.value)"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :class="{
      'base-field--error': props.error
    }"
    ></textarea>
  </div>
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
</script>

<style scoped lang="scss">
.textarea {
  padding: 15px 20px;

  &__field {
    width: 100%;
    color: inherit;
    resize: none;
    background-color: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: $system-placeholder;
    }
  }
}
</style>
