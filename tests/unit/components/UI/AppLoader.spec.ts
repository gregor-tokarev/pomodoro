// @ts-ignore
import AppLoader from '@/components/UI/AppLoader'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppLoader component', () => {
  let wrapper: VueWrapper<AppLoader>

  beforeEach(() => {
    wrapper = shallowMount(AppLoader)
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('.loader__icon').exists()).toBeTruthy()
  })
})
