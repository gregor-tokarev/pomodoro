import { Directive } from 'vue'

let element: HTMLElement
let fn: (() => void) | null = null
export const clickOutside: Directive<HTMLElement> = {
  mounted(el, bindng) {
    element = el
    fn = bindng.value
    window.addEventListener('click', clickHandler)
  },
  unmounted(el) {
    window.removeEventListener('click', clickHandler)
  }
}

function clickHandler(event: MouseEvent): void {
  event.stopPropagation()

  const target = event.target as HTMLElement
  if (!checkParent(element, target) && element !== target) {
    fn!()
  }
}

function checkParent(parent: HTMLElement, child: HTMLElement): boolean {
  let element: HTMLElement | null = child.parentElement

  console.log(parent, child)
  while (element !== null) {
    if (element === parent) {
      return true
    }
    element = element.parentElement
  }

  return false
}
