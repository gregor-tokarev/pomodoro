// @ts-ignore
import AppInput from '@/components/UI/AppInput'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppInput Component', () => {
  let wrapper: VueWrapper<AppInput>

  beforeEach(() => {
    wrapper = shallowMount(AppInput)
  })

  it('should has input tag as root', () => {
    expect(wrapper.element).toBeDefined()
    expect(wrapper.element.tagName).toBe('INPUT')
  })

  it('should sync placeholder attr with placeholder prop', async () => {
    await wrapper.setProps({ placeholder: 'someText' })
    expect(wrapper.attributes().placeholder).toBeDefined()
    expect(wrapper.attributes().placeholder).toBe('someText')
  })

  it('should has error modifier when prop error is true', async () => {
    await wrapper.setProps({ error: true })
    expect(wrapper.classes()).toContain('base-field--error')
  })

  it('should sync input value with modelValue prop', async () => {
    await wrapper.setProps({ modelValue: 'someText' })
    expect(wrapper.get('input').element.value).toBe('someText')
  })

  it('should emit update:modelValue event on input', async () => {
    await wrapper.get('input').setValue('some value')
    await wrapper.get('input').setValue('some value2')

    expect(wrapper.emitted()['update:modelValue']).toHaveLength(2)
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['some value'])
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['some value2'])
  })
})
