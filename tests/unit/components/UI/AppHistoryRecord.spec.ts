// @ts-ignore
import AppHistoryRecord from '@/components/UI/AppHistoryRecord'
import { mount, VueWrapper } from '@vue/test-utils'
import { HistoryRecord } from '../../../../models/history-record.model'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { Timestamp } from 'firebase/firestore'
import { Task } from '../../../../models/task.model'

describe('AppHistoryRecord component', () => {
  let wrapper: VueWrapper<AppHistoryRecord>

  const ownerId = nanoid()
  const tasks: Task[] = [
    {
      id: nanoid(),
      ownerId,
      status: 'completed',
      updatedAt: Timestamp.fromDate(dayjs().toDate()),
      createdAt: Timestamp.fromDate(dayjs().toDate()),
      timeCompleted: Timestamp.fromDate(dayjs().subtract(13, 'm').toDate()),
      order: 0,
      text: 'some time'
    },
    {
      id: nanoid(),
      ownerId,
      status: 'completed',
      updatedAt: Timestamp.fromDate(dayjs().toDate()),
      createdAt: Timestamp.fromDate(dayjs().toDate()),
      timeCompleted: Timestamp.fromDate(dayjs().subtract(25, 'm').toDate()),
      order: 1,
      text: 'some time'
    },
    {
      id: nanoid(),
      ownerId,
      status: 'completed',
      updatedAt: Timestamp.fromDate(dayjs().toDate()),
      createdAt: Timestamp.fromDate(dayjs().toDate()),
      timeCompleted: Timestamp.fromDate(dayjs().subtract(22, 'm').toDate()),
      order: 2,
      text: 'some time'
    }
  ]
  const record: HistoryRecord = {
    id: nanoid(),
    ownerId,
    isBreak: false,
    timeStart: Timestamp.fromDate(dayjs().subtract(35, 'm').toDate()),
    timeEnd: Timestamp.fromDate(dayjs().toDate())
  }

  beforeEach(() => {
    wrapper = mount(AppHistoryRecord, {
      props: {
        record,
        tasks
      }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('history-item')
  })

  it('should change template when isBreak is true', async () => {
    expect(!('history-item--break' in wrapper.classes())).toBe(true)
    expect(wrapper.find('.history-item__tasks').exists()).toBe(true)

    await wrapper.setProps({
      record: {
        ...record,
        isBreak: true
      }
    })

    expect(wrapper.classes()).toContain('history-item--break')
    expect(wrapper.find('.history-item__tasks').exists()).toBe(false)
  })

  it('should have duration', async () => {
    const duration = wrapper.find('.history-item__duration')
    expect(duration.exists()).toBe(true)

    expect(duration.text()).toBe('35 min')
    await wrapper.setProps({
      record: {
        ...record,
        timeStart: Timestamp.fromDate(dayjs().subtract(3, 'h').toDate())
      }
    })
    expect(duration.text()).toBe('3 hours')

    await wrapper.setProps({
      record: {
        ...record,
        timeStart: Timestamp.fromDate(dayjs().subtract(3, 's').toDate())
      }
    })
    expect(duration.text()).toBe('')
  })

  it('should have time interval', async () => {
    const interval = wrapper.find('.history-item__time')
    expect(interval.exists()).toBe(true)

    const timeStartFormatted = dayjs(record.timeStart.toDate()).format('HH:mm')
    const timeEndFormatted = dayjs(record.timeEnd?.toDate()).format('HH:mm')
    expect(interval.text()).toBe(`${timeStartFormatted} - ${timeEndFormatted}`)
  })

  it('should represent tasks length', async () => {
    expect(wrapper.find('.history-item__tasks').text()).toBe('completed tasks: 3')

    await wrapper.setProps({ tasks: [] })
    expect(wrapper.find('.history-item__tasks').text()).toBe('completed tasks: 0')
  })

  it('should render tasks', async () => {
    await wrapper.find('.history-item__info').trigger('click') // to open tasks
    const tasksEls = wrapper.findAll('.todo')

    expect(wrapper.vm.isTasksOpen).toBe(true)
    expect(tasksEls).toHaveLength(3)

    tasksEls.forEach((el, i) => {
      expect(el.find('.todo__text').text()).toBe(tasks[i].text)
      expect(el.find('.todo__time').text())
        .toBe(
          dayjs(tasks[i].timeCompleted?.toDate()).format('hh:mm')
        )
    })
  })
})
