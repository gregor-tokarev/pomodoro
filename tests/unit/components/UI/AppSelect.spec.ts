// @ts-ignore
import AppSelect from '@/components/UI/AppSelect'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { Colors } from '@/lib/UI/colors'

describe('AppSelect component', () => {
  let wrapper: VueWrapper<AppSelect>

  const options = [
    'option 1',
    'option 2',
    'option 3'
  ]
  beforeEach(() => {
    const clickOutside = jest.fn()

    wrapper = shallowMount(AppSelect, {
      props: { options },
      global: {
        directives: { clickOutside }
      }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('select')

    const body = wrapper.find('.select__body')
    expect(body.exists()).toBeTruthy()
    expect(body.find('.select__arrow').attributes().iconname).toBe('arrow-down')
  })

  it('should display placeholder', async () => {
    await wrapper.setProps({ placeholder: 'placeholder' })
    const body = wrapper.find('.select__body')

    expect(body.text()).toBe('placeholder')
    expect(body.classes()).toContain('select__body--placeholder')
  })

  it('should rotate arrow when list is opened', async () => {
    const body = wrapper.find('.select__body')
    await body.trigger('click')

    expect(body.find('.select__arrow').classes()).toContain('select__arrow--rotated')
  })

  it('should close on click outside', async () => {
    wrapper.vm.onClickOutside()
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('should add disable class on disabled prop', async () => {
    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes()).toContain('select--disabled')
  })

  it('should change icon color when disabled', async () => {
    const icon = wrapper.find('.select__arrow')
    expect(icon.attributes().color).toBe(Colors.GRAY_400)

    await wrapper.setProps({ disabled: true })
    expect(icon.attributes().color).toBe(Colors.SYSTEM_DISABLED)
  })

  it('should close after disabled is set to true', async () => {
    await wrapper.find('.select__body').trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await wrapper.setProps({ disabled: true })
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('should prevent isOpen changing when disabled is true', async () => {
    await wrapper.setProps({ disabled: true })
    const prevIsOpen = wrapper.vm.isOpen
    wrapper.vm.toggleOpenState(true)

    expect(wrapper.vm.isOpen).toBe(prevIsOpen)
  })

  it('should toggle is open', async () => {
    const prevIsOpen = wrapper.vm.isOpen
    wrapper.vm.toggleOpenState()
    expect(wrapper.vm.isOpen).toBe(!prevIsOpen)
  })

  it('should render options', async () => {
    await wrapper.find('.select__body').trigger('click')

    const optionsEls = wrapper.findAll('.select__option')
    options.forEach((option, index) => {
      expect(optionsEls[index].text()).toBe(option)
    })
  })

  it('should mark active option with class', async () => {
    await wrapper.find('.select__body').trigger('click')

    await wrapper.setProps({ modelValue: options[0] })
    const optionsEls = wrapper.findAll('.select__option')

    expect(optionsEls[0].classes()).toContain('select__option--active')
  })

  it('should emits value on click on option && close options', async () => {
    await wrapper.find('.select__body').trigger('click')

    const option = wrapper.find('.select__option')
    await option.trigger('click')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([option.text()])
    expect(wrapper.vm.isOpen).toBeFalsy()
  })
})
