// @ts-ignore
import AppTodoItem from '@/components/UI/AppTodoItem'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { Task } from '../../../../models/task.model'
import { nanoid } from 'nanoid'
import { Colors } from '@/lib/UI/colors'
import { Timestamp } from 'firebase/firestore'
import dayjs from 'dayjs'

describe('AppTodoItem component', () => {
  let wrapper: VueWrapper<AppTodoItem>

  const task: Task = {
    text: 'todo something',
    id: nanoid(),
    ownerId: nanoid(),
    order: 2,
    createdAt: Timestamp.fromDate(dayjs().toDate()),
    updatedAt: Timestamp.fromDate(dayjs().toDate()),
    timeCompleted: Timestamp.fromDate(dayjs().toDate()),
    status: 'todo'
  }

  const autogrow = jest.fn()
  const clickOutside = jest.fn()
  beforeEach(() => {
    wrapper = shallowMount(AppTodoItem, {
      props: { todoitem: task },
      global: {
        directives: {
          autogrow,
          clickOutside
        }
      }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('todo-item')
  })

  it('should add drag icon on isDraggable prop', async () => {
    expect(wrapper.find('.todo-item__drag').exists()).toBe(false)

    await wrapper.setProps({ isDraggable: true })
    expect(wrapper.find('.todo-item__drag').exists()).toBe(true)
    expect(wrapper.find('.todo-item__drag').attributes().color).toBe(Colors.GRAY_200)
    expect(wrapper.find('.todo-item__drag').attributes().iconname).toBe('drag-dots')
  })

  // it('should allow editing on canEdit prop', async () => {
  //   const textarea = wrapper.find('.todo-item__text')
  //   expect(textarea.attributes().readonly).toBe(false)
  //   expect(wrapper.find('.todo-item__context-menu').exists()).toBe(false)
  //
  //   await wrapper.setProps({ canEdit: true })
  //   // @ts-ignore
  //   console.log(textarea.element.readOnly)
  //   expect(textarea.attributes().readonly).toBe(true)
  //   expect(wrapper.find('.todo-item__context-menu').exists()).toBe(true)
  // })

  it('should render textarea value', () => {
    const textarea = wrapper.find('.todo-item__text')

    // @ts-ignore
    expect(textarea.element.value).toBe(task.text)
  })

  it('should display time when completed', async () => {
    let time = wrapper.find('.todo-item__time')
    expect(time.exists()).toBe(false)

    await wrapper.setProps({
      todoitem: {
        ...task,
        status: 'completed'
      }
    })

    time = wrapper.find('.todo-item__time')
    expect(time.exists()).toBe(true)
    expect(time.text()).toBe(dayjs(task.timeCompleted?.toDate()).format('hh:mm'))
  })

  it('should change template based on inProgress prop', async () => {
    await wrapper.setProps({ inProgress: true })
    expect(wrapper.classes()).toContain('todo-item--inprogress')

    await wrapper.setProps({ isDraggable: true })
    expect(wrapper.find('.todo-item__drag').attributes().color).toBe(Colors.ACCENT_MAIN)
  })

  it('should mark checkbox as completed based on completed status', async () => {
    const checkbox = wrapper.find('.todo-item__checkbox')
    expect(checkbox.attributes().modelvalue).toBe('false')

    await wrapper.setProps({
      todoitem: {
        ...task,
        status: 'completed'
      }
    })
    expect(checkbox.attributes().modelvalue).toBe('true')
  })

  it('should emit value when clicking on checkbox', async () => {
    wrapper.vm.isCompleted = true
    expect(wrapper.emitted().changeStatus).not.toBeDefined()

    await wrapper.setProps({ inProgress: true }) // to allow complete task
    wrapper.vm.isCompleted = true

    expect(wrapper.emitted().changeStatus[0]).toEqual([{
      taskId: task.id,
      status: 'completed'
    }])
  })

  it('should emit value when change it in textarea', async () => {
    const textarea = wrapper.find('.todo-item__text')
    const text = 'some text'
    await textarea.setValue(text)

    expect(wrapper.emitted().changeText[0]).toEqual([{
      taskId: task.id,
      text
    }])
  })
})
