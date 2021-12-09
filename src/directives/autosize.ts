import { Directive } from 'vue'

export const autosize: Directive<HTMLTextAreaElement> = {
  mounted(el) {
    el.style.overflowY = 'hidden'
    applyActualHeight(el)
    el.addEventListener('input', inputHandler)
  },
  unmounted(el) {
    el.removeEventListener('input', inputHandler)
  }
}

function inputHandler(event: Event): void {
  const target = event.currentTarget as HTMLTextAreaElement
  applyActualHeight(target)
}

function applyActualHeight(el: HTMLTextAreaElement) {
  el.style.height = '0px'
  const actualHeight = el.scrollHeight

  el.style.height = `${actualHeight}px`
}
