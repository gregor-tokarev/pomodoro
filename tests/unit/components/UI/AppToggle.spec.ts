// @ts-ignore
import AppToggle from '@/components/UI/AppToggle'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { Colors } from '@/lib/UI/colors'

describe('AppToggle component', () => {
  let wrapper: VueWrapper<AppToggle>

  beforeEach(() => {
    wrapper = shallowMount(AppToggle)
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('toggle')
  })

  it('should render based on modelValue', async () => {
    let icon = wrapper.find('.toggle__icon')

    expect(wrapper.classes()).not.toContain('toggle--on')
    expect(icon.exists()).toBe(false)

    await wrapper.setProps({ modelValue: true })
    icon = wrapper.find('.toggle__icon')
    expect(wrapper.classes()).toContain('toggle--on')
    expect(icon.exists()).toBe(true)

    expect(icon.attributes().color).toBe(Colors.GRAY_000)
    expect(icon.attributes().iconname).toBe('check')
  })

  it('should emit value on clicked', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([!wrapper.vm.modelValue])
  })
})
