import { Task } from '../../../models/task.model'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { Update } from '../../../types/update'
import { RootState } from '@/store'
import isBetween from 'dayjs/plugin/isBetween'
import { nanoid } from 'nanoid'
import { firestore } from '@/lib/firebase'
import { HistoryRecord } from '../../../models/history-record.model'
import dayjs from 'dayjs'
import firebase from 'firebase/compat'
import { User } from '../../../models/user.model'

dayjs.extend(isBetween)

export interface TaskState {
  tasks: Task[]
}

const state: TaskState = {
  tasks: []
}

const mutations: MutationTree<TaskState> = {
  SET_TASKS(state, tasks: Task[]) {
    state.tasks = tasks
  },
  ADD_TASK(state, task: Task) {
    state.tasks.push(task)
  },
  DELETE_TASK(state, taskId: string) {
    const taskIndex = state.tasks.findIndex(task => task.id === taskId)
    const deletedTask = state.tasks[taskIndex]
    const greaterOrderTasks = state.tasks.filter(task => task.order > deletedTask.order)

    state.tasks.splice(taskIndex, 1)

    greaterOrderTasks.forEach(task => task.order++)
  },
  EDIT_TASK(state, update: Update<Task>) {
    const taskIndex = state.tasks.findIndex(task => task.id === update.id)

    state.tasks[taskIndex] = {
      ...state.tasks[taskIndex],
      ...update.changes
    }
  },
  UNCOMPLETE_TASKS(state, timeStart: firebase.firestore.Timestamp) {
    const tasks = state
      .tasks
      .filter(task => task.timeCompleted)
      .filter(task => dayjs(task.timeCompleted?.toDate()).isAfter(dayjs(timeStart.toDate())))
      .map<Task>(task => ({
        ...task,
        status: 'todo',
        timeCompleted: null
      }))
    const tasksIds = tasks.map(task => task.id)

    state.tasks = state.tasks
      .reduce((acc, task) => {
        if (tasksIds.includes(task.id)) {
          const finedTask = tasks.find(t => t.id === task.id)
          finedTask && acc.push(finedTask)
          return acc
        }
        acc.push(task)
        return acc
      }, [] as Task[])
  }
}

const actions: ActionTree<TaskState, RootState> = {
  async addTask({
    commit,
    getters,
    rootGetters
  }, taskValues: Partial<Task>): Promise<Task | undefined> {
    const userId = rootGetters['authModule/userId']

    const taskId = nanoid()
    const task: Omit<Task, 'id'> = {
      ownerId: userId,
      order: getters.getMaxOrderValue + 1,
      status: 'todo',
      text: taskValues.text ?? '',
      createdAt: firebase.firestore.Timestamp.now(),
      updatedAt: firebase.firestore.Timestamp.now(),
      timeCompleted: null
    }

    try {
      commit('ADD_TASK', {
        ...task,
        id: taskId
      })
      await firestore.collection('tasks').doc(taskId).set(task)
      commit('authModule/CHANGE_COUNTER', {
        value: 1,
        counter: 'tasks'
      }, { root: true })

      return {
        ...task,
        id: taskId
      }
    } catch (err) {
      console.error(err)
    }
  },
  async editTask({
    commit,
    getters
  }, update: Update<Task>): Promise<Task> {
    try {
      commit('EDIT_TASK', update)
      await firestore
        .collection('tasks')
        .doc(update.id)
        .update({
          ...update.changes,
          updatedAt: firebase.firestore.Timestamp.now()
        })

      return getters.taskById(update.id)
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async deleteTask({ commit }, taskId: string): Promise<string> {
    try {
      commit('DELETE_TASK', taskId)
      await firestore.collection('tasks').doc(taskId).delete()

      commit('authModule/CHANGE_COUNTER', {
        value: -1,
        counter: 'tasks'
      }, { root: true })

      return taskId
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async changeTaskOrder({
    commit,
    getters
  }, {
    taskId,
    newOrder
  }: { taskId: string, newOrder: number }): Promise<void> {
    let promises: Promise<void>[] = []

    try {
      const task: Task = getters.taskById(taskId)
      if (newOrder < task.order) {
        const tasksToByReordered: Task[] = getters
          .tasksOrderInterval(newOrder, task.order)
          .filter((task: Task) => task.id !== taskId)

        promises = tasksToByReordered.map(task => {
          commit('EDIT_TASK', {
            id: task.id,
            changes: {
              order: task.order + 1
            }
          })

          return firestore
            .collection('tasks')
            .doc(task.id)
            .update({ order: task.order + 1 })
        })
      } else {
        const tasksToByReordered: Task[] = getters
          .tasksOrderInterval(task.order, newOrder)
          .filter((task: Task) => task.id !== taskId)

        promises = tasksToByReordered.map(task => {
          commit('EDIT_TASK', {
            id: task.id,
            changes: {
              order: task.order - 1
            }
          })

          return firestore
            .collection('tasks')
            .doc(task.id)
            .update({ order: task.order - 1 })
        })
      }

      await Promise.all(promises)

      commit('EDIT_TASK', {
        id: taskId,
        changes: { order: newOrder }
      })
      await firestore
        .collection('tasks')
        .doc(taskId)
        .update({ order: newOrder })

      return getters.taskById(taskId)
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async fetchTasks({
    commit,
    rootGetters
  }, {
    limit,
    daysFromNow
  }: { limit?: number, daysFromNow?: number } = {}): Promise<Task[]> {
    const userId = rootGetters['authModule/userId']

    try {
      const query = firestore
        .collection('tasks')
        .where('ownerId', '==', userId)
        .where(
          'updatedAt',
          '>',
          firebase.firestore.Timestamp.fromDate(dayjs().subtract(daysFromNow ?? 2, 'days').toDate())
        )

      limit && query.limit(limit)

      let tasks: any[] = (await query.get()).docs

      tasks = tasks.map(task => ({
        ...task.data() as Omit<Task, 'id'>,
        id: task.id
      }))

      commit('SET_TASKS', tasks)
      return tasks
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

const getters: GetterTree<TaskState, RootState> = {
  tasks(state): Task[] {
    return state.tasks
      .filter((task: Task) => {
        const timeUpdated = dayjs(task.updatedAt.toDate())
        return timeUpdated.isAfter(dayjs().subtract(1, 'd'))
      })
      .sort((prev, next) => prev.order - next.order)
  },
  tasksInHistoryInterval(state, getters, rootState, rootGetters): (recordId: string) => Task[] {
    return recordId => {
      const record = rootGetters['timerModule/recordById'](recordId) as HistoryRecord
      const {
        timeEnd,
        timeStart
      } = record

      return state.tasks.filter(
        (task: Task) => dayjs(task.timeCompleted?.toDate())
          .isBetween(
            dayjs(timeStart.toDate()),
            dayjs(timeEnd?.toDate()),
            'second',
            '[]'
          )
      )
    }
  },
  tasksForTimer(state, getters): Task[] {
    return getters.tasks
      .filter((task: Task) => task.status !== 'completed')
      .slice(0, 5)
  },
  tasksOrderInterval(state): (startOrder: number, stopOrder: number) => Task[] {
    return (startOrder, stopOrder) =>
      state.tasks.filter(task => startOrder <= task.order && task.order <= stopOrder)
  },
  taskById(state): (taskId: string) => Task | undefined {
    return taskId => state.tasks.find(task => task.id === taskId)
  },
  getMaxOrderValue(state, getters, rootState, rootGetters): number {
    const user = rootGetters['authModule/getUser'] as User
    return user.counters.tasks - 1
  },
  getMinOrderValue(state, getters): number {
    return Math.min(...getters.tasks.map((task: Task) => task.order))
  },
  runningTaskId(state, getters, _, rootGetters): string | null {
    if (rootGetters['timerModule/runningRecord']?.isBreak) {
      return null
    }

    return rootGetters['timerModule/runningRecord']
      ? getters
        .tasks
        .find((task: Task) => task.status !== 'completed')
        ?.id
      : null
  }
}

export const tasksModule: Module<TaskState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
