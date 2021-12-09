import { Directive } from 'vue'

let fn: ((event: MouseEvent) => void) | null = null
export const clickOutside: Directive<HTMLElement> = {
  mounted(el, bindng) {
    fn = bindng.value
    window.addEventListener('click', clickHandler)
  },
  unmounted(el) {
    el.removeEventListener('click', clickHandler)
  }
}

function clickHandler(event: MouseEvent): void {
  const target = event.target
}
