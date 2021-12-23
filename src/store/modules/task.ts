import { ITask } from '../../../models/task.model'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { Update } from '../../../types/update'
import { RootState } from '@/store'
import { nanoid } from 'nanoid'
import { firestore } from '@/assets/ts/firebase'

interface TaskState {
  tasks: ITask[]
}

const state: TaskState = {
  tasks: []
}

const mutations: MutationTree<TaskState> = {
  SET_TASKS(state, tasks: ITask[]): void {
    state.tasks = tasks
  },
  ADD_TASK(state, task: ITask): void {
    const maxOrderTask: number = Math.max(...state.tasks.map(task => task.order))

    task.order = maxOrderTask + 1
    state.tasks.push(task)
  },
  DELETE_TASK(state, taskId: string): void {
    const taskIndex = state.tasks.findIndex(task => task.id === taskId)
    const deletedTask = state.tasks[taskIndex]
    const greaterOrderTasks = state.tasks.filter(task => task.order > deletedTask.order)

    state.tasks.splice(taskIndex, 1)

    greaterOrderTasks.forEach(task => task.order++)
  },
  EDIT_TASK(state, update: Update<ITask>): void {
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
  }, taskValues: Partial<ITask>): Promise<ITask | undefined> {
    const userId = rootGetters['authModule/userId']

    const taskId = nanoid()
    const task: Omit<ITask, 'id'> = {
      ownerId: userId,
      order: getters.getMaxOrderValue,
      status: 'todo',
      text: taskValues.text ?? ''
    }
    try {
      commit('ADD_TASK', task)
      await firestore.collection('tasks').doc(taskId).set(task)

      return {
        ...task,
        id: taskId
      }
    } catch (err) {
      console.error(err)
    }
  },
  async fetchTasks({
    commit,
    rootGetters
  }): Promise<ITask[] | undefined> {
    const userId = rootGetters['authModule/userId']

    try {
      const query = firestore.collection('tasks').where('ownerId', '==', userId)
      const result = await query.get()

      const tasks = result.docs.map(task => ({
        ...task.data() as Omit<ITask, 'id'>,
        id: task.id
      }))

      commit('SET_TASKS', tasks)
      return tasks
    } catch (err) {
      console.error(err)
    }
  }
}

const getters: GetterTree<TaskState, RootState> = {
  tasks(state): ITask[] {
    return state.tasks.sort((prev, next) => prev.order - next.order)
  },
  getMaxOrderValue(state): number {
    return Math.max(...state.tasks.map(task => task.order)) ?? 0
  }
}

export const tasksModule: Module<TaskState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
