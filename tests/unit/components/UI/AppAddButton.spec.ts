// @ts-ignore
import AppAddButton from '@/components/UI/AppAddButton'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppAddButton component', () => {
  let wrapper: VueWrapper<AppAddButton>

  beforeEach(() => {
    wrapper = shallowMount(AppAddButton, {
      slots: { default: 'Add Task' }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('add-button')
  })

  it('should have icon', () => {
    expect(wrapper.find('.add-button__plus').exists()).toBe(true)
  })

  it('should display slot content', () => {
    expect(wrapper.find('.add-button__text').exists()).toBe(true)
    expect(wrapper.find('.add-button__text').text()).toBe('Add Task')
  })
})
