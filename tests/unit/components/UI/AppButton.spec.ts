// @ts-ignore
import AppButton from '@/components/UI/AppButton'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('Test ui button component', () => {
  let wrapper: VueWrapper<AppButton>

  it('should contain button tag as root', () => {
    wrapper = shallowMount(AppButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('should print slot text', () => {
    wrapper = shallowMount(AppButton, {
      slots: {
        default: 'hello'
      }
    })

    expect(wrapper.html()).toContain('hello')
  })

  it('should use class modifier on prop styleType passed', async () => {
    wrapper = shallowMount(AppButton)
    expect(wrapper.classes()).toContain('button')

    await wrapper.setProps({ styleType: 'common' })
    expect(wrapper.classes()).toContain('button--common')

    await wrapper.setProps({ styleType: 'light' })
    expect(wrapper.classes()).toContain('button--light')

    await wrapper.setProps({ styleType: 'ghost' })
    expect(wrapper.classes()).toContain('button--ghost')
  })

  it('should add disable class modifier when pass disable prop', async () => {
    wrapper = shallowMount(AppButton)

    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes()).toContain('button--disabled')
  })
})
