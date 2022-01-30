// @ts-ignore
import AppBack from '@/components/UI/AppBack'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppBack component', () => {
  let wrapper: VueWrapper<AppBack>

  beforeEach(() => {
    wrapper = shallowMount(AppBack)
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('back')
  })
})
