// @ts-ignore
import AppTextarea from '@/components/UI/AppTextarea'
import { DOMWrapper, shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppTextarea component', () => {
  let wrapper: VueWrapper<AppTextarea>
  let textarea: DOMWrapper<HTMLTextAreaElement>

  beforeEach(() => {
    const autogrow = jest.fn()
    wrapper = shallowMount(AppTextarea, {
      global: {
        directives: { autogrow }
      }
    })
    textarea = wrapper.find('.textarea__field')
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('textarea')

    expect(textarea.exists()).toBe(true)
  })

  it('should pass placeholder to template', async () => {
    await wrapper.setProps({ placeholder: 'some' })
    expect(textarea.attributes().placeholder).toBe('some')
  })

  it('should add error class when error prop', async () => {
    await wrapper.setProps({ error: true })
    expect(textarea.classes()).toContain('base-field--error')
  })

  it('should model value', async () => {
    await wrapper.setProps({ modelValue: 'some1' })
    expect(textarea.element.value).toBe('some1')

    await textarea.setValue('some new')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['some new'])
  })
})
