// @ts-ignore
import AppCheckbox from '@/components/UI/AppCheckbox'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppCheckbox component', () => {
  let wrapper: VueWrapper<AppCheckbox>

  beforeEach(() => {
    wrapper = shallowMount(AppCheckbox)
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('checkbox')
  })

  it('should switch checked class with model value', async () => {
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('checkbox--checked')
  })

  it('should emit opposite to modelValue value when clicked', async () => {
    await wrapper.setProps({ modelValue: true })
    await wrapper.trigger('click')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([false])
  })

  it('should appear icon when modelValue is true', async () => {
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('app-icon-stub').exists()).toBe(true)

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('app-icon-stub').exists()).toBe(false)
  })
})
