// @ts-ignore
import AppTimer from '@/components/UI/AppTimer'
import { shallowMount, VueWrapper } from '@vue/test-utils'

describe('AppTimer component', () => {
  let wrapper: VueWrapper<AppTimer>

  beforeEach(() => {
    wrapper = shallowMount(AppTimer)
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('timer')

    const waves = wrapper.findAll('.timer__wave')
    expect(waves).toHaveLength(2)

    const lift = wrapper.find('.timer__lift')
    expect(lift.exists()).toBeTruthy()
  })

  it('should add break class based on prop', async () => {
    expect(wrapper.classes()).not.toContain('timer--break')

    await wrapper.setProps({ isBreak: true })
    expect(wrapper.classes()).toContain('timer--break')
  })

  it('should display time', async () => {
    const time = wrapper.find('.timer__numbers')
    const timeStr = '13:34'

    await wrapper.setProps({ time: timeStr })
    expect(time.text()).toBe(timeStr)
  })

  it('should sync lift height and wave position based on percent prop', async () => {
    const progressPercent = 55
    await wrapper.setProps({ progressPercent })

    const waves = wrapper.findAll('.timer__wave')

    // @ts-ignore
    jest.spyOn(wrapper.element, 'offsetHeight', 'get').mockImplementation(() => 400)
    waves.forEach(wave => {
      // @ts-ignore
      jest.spyOn(wave.element, 'offsetHeight', 'get').mockImplementation(() => 50)
    })

    const rightOutput = '192.5px'
    expect(wrapper.vm.liftHeight).toBe(rightOutput)
  })
})
