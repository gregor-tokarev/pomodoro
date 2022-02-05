// @ts-ignore
import Sortable from '@/components/utils/Sortable'
import { mount, VueWrapper } from '@vue/test-utils'

describe('Sortable component', () => {
  let wrapper: VueWrapper<Sortable>

  beforeEach(() => {
    wrapper = mount(Sortable, {
      slots: {
        default: `
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        `
      }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('UL')
  })

  it('should pass slot', () => {
    const els = wrapper.findAll('li')
    expect(els).toHaveLength(4)
  })

  it('should receive root ref', () => {
    expect(wrapper.vm.root).toBeDefined()
  })
})
