import { Directive } from 'vue'

export const autogrow: Directive<HTMLInputElement> = {
  mounted(el, binding) {
    if (binding.arg === 'horizontal') {
      // @ts-ignore
      setImmediate(() => {
        setWidth(el)
      })

      el.addEventListener('input', widthHandler)
    } else {
      el.style.overflowY = 'hidden'
      el.style.resize = 'none'

      setHeight(el)
      el.addEventListener('input', heightHandler)
    }
  },

  unmounted(el, binding) {
    if (binding.arg === 'horizontal') {
      el.removeEventListener('input', widthHandler)
    } else {
      el.removeEventListener('input', heightHandler)
    }
  }
}

function heightHandler(event: Event) {
  setHeight(event.currentTarget as HTMLInputElement)
}
function widthHandler(event: Event) {
  setWidth(event.currentTarget as HTMLInputElement)
}

function setHeight(el: HTMLInputElement): void {
  if (el.value === '') {
    return
  }

  const initialHeight = el.style.height

  el.style.height = '0px'
  el.style.height = el.scrollHeight
    ? el.scrollHeight + 'px'
    : initialHeight + 'px'
}

function setWidth(el: HTMLInputElement): void {
  const span = document.createElement('span')

  span.style.fontSize = getComputedStyle(el, null).fontSize
  span.style.fontWeight = getComputedStyle(el, null).fontWeight
  span.style.fontFamily = getComputedStyle(el, null).fontFamily
  span.style.position = 'absolute'
  span.style.whiteSpace = 'pre'
  span.style.top = '50%'
  span.style.left = '50%'

  span.textContent = (el.value || el.placeholder) + el.style.fontSize

  document.body.appendChild(span)
  el.style.width = span.offsetWidth + 1 + 'px'
  span.remove()
}
