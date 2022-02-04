// @ts-ignore
import AppContextMenu from '@/components/UI/AppContextMenu'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppContextMenu component', () => {
  let wrapper: VueWrapper<AppContextMenu>

  beforeEach(() => {
    const clickOutside = jest.fn()
    wrapper = shallowMount(AppContextMenu, {
      global: {
        directives: { clickOutside }
      }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('context-menu')
  })

  it('should show/hide based on modelValue', async () => {
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.isVisible()).toBe(true)

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('should emits update:modelValue on clickOutside', () => {
    wrapper.vm.clickOutside()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([false])
  })
})
