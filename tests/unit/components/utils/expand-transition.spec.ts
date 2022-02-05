// @ts-ignore
import ExpandTransition from '@/components/utils/expand-transition'
import { mount, VueWrapper } from '@vue/test-utils'

describe('ExpandTransition component', () => {
  let wrapper: VueWrapper<ExpandTransition>

  beforeEach(() => {
    const parent = document.createElement('div')
    wrapper = mount(ExpandTransition, {
      global: {
        stubs: { transition: false }
      },
      slots: {
        default: '<p>Some text</p>'
      },
      attachTo: parent
    })
  })

  it('should keep structure', async () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
  })
})
