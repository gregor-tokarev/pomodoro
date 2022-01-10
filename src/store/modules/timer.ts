import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { HistoryRecord } from '../../../models/history-record.model'
import utc from 'dayjs/plugin/utc'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { firestore } from '@/lib/firebase'
import { secondsToTime } from '@/lib/secondsToTime'
import { getTimeStr } from '@/lib/getTimeStr'
import firebase from 'firebase/compat'

dayjs.extend(utc)

export interface TimerState {
  records: HistoryRecord[]
  timeFormatted: string
  completionPercent: number
  runner: (ReturnType<typeof setInterval>) | null

  // @ts-ignore
  recordListener: ReturnType<firebase.firestore.DocumentReference.onSnapshop> | null
}

const state: TimerState = {
  records: [],
  timeFormatted: '',
  completionPercent: 0,
  runner: null,

  recordListener: null
}

const mutations: MutationTree<TimerState> = {
  ADD_RECORD(state, record: HistoryRecord) {
    state.records.push(record)
  },
  SET_HISTORY(state, records: HistoryRecord[]) {
    state.records = records
  },
  FINISH_RECORD(state, {
    recordId,
    timeEnd
  }: { recordId: string, timeEnd: string }) {
    const record = state.records.find(record => record.id === recordId)
    if (record) {
      record.timeEnd = timeEnd
    }
  },
  DELETE_RECORD(state, recordId) {
    const recordIndex = state.records.findIndex(record => record.id === recordId)
    state.records.splice(recordIndex, 1)
  },

  CREATE_RUNNER(state, runner: ReturnType<typeof setInterval>) {
    state.runner = runner
  },
  CLEAR_RUNNER(state) {
    if (state.runner) {
      clearInterval(state.runner)
      state.runner = null
    }
  },

  UPDATE_COMPLETION_PERCENT(state, percent: number) {
    state.completionPercent = percent
  },
  UPDATE_TIME_FORMATTED(state, time: string) {
    state.timeFormatted = time
  },

  // @ts-ignore
  SET_RECORD_LISTENER(state, listener: ReturnType<firebase.firestore.DocumentReference.onSnapshop>) {
    state.recordListener = listener
  },
  CLEAR_RECORD_LISTENER(state) {
    if (!state.recordListener) {
      return
    }

    state.recordListener()
    state.recordListener = null
  }
}

const actions: ActionTree<TimerState, RootState> = {
  async fetchRecords({
    commit,
    rootGetters
  }): Promise<HistoryRecord[]> {
    try {
      const userId = rootGetters['authModule/userId']
      const query = firestore.collection('history').where('ownerId', '==', userId)

      const { docs } = await query.get()
      const history: HistoryRecord[] = docs.map(doc => ({
        ...doc.data() as Omit<HistoryRecord, 'id'>,
        id: doc.id
      }))

      commit('SET_HISTORY', history)
      return history
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  setupRunner({
    commit,
    getters,
    rootGetters,
    dispatch,
    state
  }, { time } = { time: 1000 }) {
    if (state.runner) {
      return
    }

    const runner = setInterval(() => {
      if (!getters.runningRecord) {
        return ''
      }

      const time = secondsToTime(getters.timeInSeconds)
      commit('UPDATE_TIME_FORMATTED', getTimeStr(time))

      const runningRecord: HistoryRecord = getters.runningRecord
      if (!runningRecord) {
        return
      }

      const totalTimeMinutes: number = runningRecord.isBreak
        ? rootGetters['settingsModule/userSettings'].breakTime * 60
        : rootGetters['settingsModule/userSettings'].workTime * 60

      const passedTimeMinutes: number = Math.floor(getters.timeInSeconds)
      commit('UPDATE_COMPLETION_PERCENT', (passedTimeMinutes / totalTimeMinutes) * 100)
    }, time)
    commit('CREATE_RUNNER', runner)

    const listener = firestore
      .collection('history')
      .doc(getters.runningRecord.id)
      .onSnapshot(snapshot => {
        const record = snapshot.data() as HistoryRecord

        if (record.timeEnd) {
          dispatch('finishTimer')
        }
      })
    commit('SET_RECORD_LISTENER', listener)
  },
  clearRunner({ commit }) {
    commit('CLEAR_RUNNER')
    commit('UPDATE_TIME_FORMATTED', '')
    commit('UPDATE_COMPLETION_PERCENT', 0)
  },
  async startTimer({
    commit,
    rootGetters,
    dispatch
  }): Promise<HistoryRecord> {
    try {
      const recordId = nanoid()
      const historyRecord: Omit<HistoryRecord, 'id' | 'timeEnd'> = {
        isBreak: false,
        ownerId: rootGetters['authModule/userId'],
        timeStart: dayjs().utc().format()
      }

      await firestore.collection('history').doc(recordId).set(historyRecord)

      const record = { id: recordId, ...historyRecord }
      commit('ADD_RECORD', record)

      dispatch('setupRunner')

      await dispatch('tasksModule/editTask', {
        id: rootGetters['tasksModule/runningTaskId'],
        changes: { status: 'inprogress' }
      }, { root: true })

      return record
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async finishTimer({
    commit,
    getters,
    dispatch
  }): Promise<HistoryRecord> {
    try {
      const timeEnd = dayjs().utc().format()

      commit('FINISH_RECORD', {
        recordId: getters.runningRecord.id,
        timeEnd
      })
      dispatch('clearRunner')

      return getters.runningRecord
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async resetTimer({
    commit,
    getters,
    dispatch,
    rootGetters
  }): Promise<void> {
    const runningRecord = getters.runningRecord
    if (!runningRecord) {
      throw new Error('Timer is not running')
    }
    commit('CLEAR_RECORD_LISTENER')

    try {
      const recordRef = firestore.collection('history').doc(runningRecord.id)
      await recordRef.delete()

      dispatch('clearRunner')

      await dispatch('tasksModule/editTask', {
        id: rootGetters['tasksModule/runningTaskId'],
        changes: { status: 'todo' }
      }, { root: true })
      commit('DELETE_RECORD', runningRecord.id)
    } catch (err) {
      console.error(err)
    }
  }
}

const getters: GetterTree<TimerState, RootState> = {
  allFinishedRecords(state): HistoryRecord[] {
    return state.records.filter(record => record.timeEnd)
  },
  recordById(state): (recordId: string) => HistoryRecord | undefined {
    return recordId => state.records.find(record => record.id === recordId)
  },
  runningRecord(state): HistoryRecord | undefined {
    return state.records.find(record => record.timeStart && !record.timeEnd)
  },
  isRunning(state, getters): boolean {
    return !!getters.runningRecord
  },
  timeInSeconds(state, getters): number | undefined {
    if (!getters.runningRecord) {
      return
    }

    const now = dayjs()
    const start = getters.runningRecord.timeStart

    return now.diff(start, 'second')
  },
  timeFormatted(state): string {
    return state.timeFormatted
  },
  completionPercent(state): number {
    return state.completionPercent
  }
}

export const timerModule: Module<TimerState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
