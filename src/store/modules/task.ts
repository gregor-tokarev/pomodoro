import { Task } from '../../../models/task.model'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { Update } from '../../../types/update'
import { RootState } from '@/store'
import { nanoid } from 'nanoid'
import { firestore } from '@/lib/firebase'

export interface TaskState {
  tasks: Task[]
}

const state: TaskState = {
  tasks: []
}

const mutations: MutationTree<TaskState> = {
  SET_TASKS(state, tasks: Task[]): void {
    state.tasks = tasks
  },
  ADD_TASK(state, task: Task): void {
    state.tasks.push(task)
  },
  DELETE_TASK(state, taskId: string): void {
    const taskIndex = state.tasks.findIndex(task => task.id === taskId)
    const deletedTask = state.tasks[taskIndex]
    const greaterOrderTasks = state.tasks.filter(task => task.order > deletedTask.order)

    state.tasks.splice(taskIndex, 1)

    greaterOrderTasks.forEach(task => task.order++)
  },
  EDIT_TASK(state, update: Update<Task>): void {
    const taskIndex = state.tasks.findIndex(task => task.id === update.id)

    state.tasks[taskIndex] = {
      ...state.tasks[taskIndex],
      ...update.changes
    }
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
      text: taskValues.text ?? ''
    }

    try {
      commit('ADD_TASK', {
        ...task,
        id: taskId
      })
      await firestore.collection('tasks').doc(taskId).set(task)

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
        .update(update.changes)

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
  }, { limit }: { limit?: number } = {}): Promise<Task[]> {
    const userId = rootGetters['authModule/userId']

    try {
      let query = firestore.collection('tasks').where('ownerId', '==', userId)
      if (limit) {
        query = query.limit(limit)
      }
      const result = await query.get()

      const tasks = result.docs.map(task => ({
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
    return state.tasks.sort((prev, next) => prev.order - next.order)
  },
  tasksForTimer(state, getters): Task[] {
    return getters.tasks.slice(0, 4)
  },
  tasksOrderInterval(state): (startOrder: number, stopOrder: number) => Task[] {
    return (startOrder, stopOrder) =>
      state.tasks.filter(task => startOrder <= task.order && task.order <= stopOrder)
  },
  taskById(state): (taskId: string) => Task | undefined {
    return taskId => state.tasks.find(task => task.id === taskId)
  },
  getMaxOrderValue(state): number {
    const maxOrder = Math.max(...state.tasks.map(task => task.order))
    return state.tasks.length ? maxOrder : -1
  },
  runningTaskId(state, getters, _, rootGetters): string | null {
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
