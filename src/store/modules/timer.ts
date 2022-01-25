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
import { timerObservable } from '@/lib/TimerObservable'
import unionBy from 'lodash/unionBy'
import { getOldestRecord } from '@/lib/get-oldest-record'

dayjs.extend(utc)

export interface TimerState {
  records: HistoryRecord[]
  noMoreRecords: boolean

  timeFormatted: string
  completionPercent: number
  runner: (ReturnType<typeof setInterval>) | null

  listeners: {
    // @ts-ignore
    work: ReturnType<firebase.firestore.DocumentReference.onSnapshop> | null,
    // @ts-ignore
    break: ReturnType<firebase.firestore.DocumentReference.onSnapshop> | null
  }
}

const state: TimerState = {
  records: [],
  noMoreRecords: false,

  timeFormatted: '',
  completionPercent: 0,
  runner: null,

  listeners: {
    work: null,
    break: null
  }
}

const mutations: MutationTree<TimerState> = {
  ADD_RECORD(state, record: HistoryRecord) {
    state.records.push(record)
  },
  SET_HISTORY(state, records: HistoryRecord[]) {
    state.records = unionBy<HistoryRecord>(state.records, records, 'id')
  },
  SET_HISTORY_FULLNESS(state, value: boolean) {
    state.noMoreRecords = value
  },
  FINISH_RECORD(state, {
    recordId,
    timeEnd
  }: { recordId: string, timeEnd: firebase.firestore.Timestamp }) {
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
  CLEAR_LISTENERS(state) {
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

  SET_HISTORY_LISTENERS(
    state,
    listeners: {
      // @ts-ignore
      work?: ReturnType<firebase.firestore.DocumentReference.onSnapshop>,
      // @ts-ignore
      break?: ReturnType<firebase.firestore.DocumentReference.onSnapshop>
    }
  ) {
    if (listeners.work) {
      state.listeners.work = listeners.work
    }
    if (listeners.break) {
      state.listeners.break = listeners.break
    }
  },
  CLEAR_HISTORY_LISTENERS(state) {
    if (state.listeners.work) {
      state.listeners.work()
      state.listeners.work = null
    }

    if (state.listeners.break) {
      state.listeners.break()
      state.listeners.break = null
    }
  }
}

const actions: ActionTree<TimerState, RootState> = {
  async fetchRecords(
    {
      commit,
      dispatch,
      rootGetters,
      getters
    },
    settings: { daysFromNow?: number, limit?: number, timeStartPoint?: number } = {}
  ): Promise<HistoryRecord[]> {
    console.log(getters.historyFullness)
    if (getters.historyFullness) {
      return []
    }

    try {
      const userId = rootGetters['authModule/userId']
      let query = firestore
        .collection('history')
        .where('ownerId', '==', userId)
        .orderBy('timeEnd', 'desc')

      if (settings.daysFromNow) {
        query = query
          .where(
            'timeStart',
            '>',
            firebase
              .firestore
              .Timestamp
              .fromDate(dayjs().subtract(settings.daysFromNow, 'days').toDate())
          )
      }

      if (settings.timeStartPoint) {
        query = query.startAfter(settings.timeStartPoint)
      }

      if (settings.limit) {
        query = query.limit(settings.limit)
      }

      const { docs } = await query.get()

      const history: HistoryRecord[] = docs.map(doc => ({
        ...doc.data() as Omit<HistoryRecord, 'id'>,
        id: doc.id
      }))

      const allHistory = unionBy(history, getters.allFinishedRecords, 'id')
      if (allHistory.length === getters.allFinishedRecords.length) {
        commit('SET_HISTORY_FULLNESS', true)
        return []
      }

      const daysFromNow = dayjs().diff(dayjs(getOldestRecord(allHistory)?.timeStart.toDate()), 'd')
      await dispatch('tasksModule/fetchTasks', { daysFromNow: daysFromNow + 1 }, { root: true })

      commit('SET_HISTORY', history)
      return history
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async fetchActiveRecord({
    commit,
    rootGetters
  }): Promise<HistoryRecord | undefined> {
    try {
      const userId = rootGetters['authModule/userId']

      const query = firestore
        .collection('history')
        .where('ownerId', '==', userId)
        .where('timeEnd', '==', null)

      const { docs } = await query.get()
      if (docs.length > 0) {
        const record: HistoryRecord = {
          ...docs[0].data() as Omit<HistoryRecord, 'id'>,
          id: docs[0].id
        }
        commit('ADD_RECORD', record)

        return record
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  setupRunner({
    commit,
    getters,
    rootGetters,
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
  },
  setupWorkListener({
    getters,
    dispatch,
    commit
  }) {
    const workListener = firestore
      .collection('history')
      .doc(getters.runningRecord.id)
      .onSnapshot(snapshot => {
        const record = snapshot.data() as HistoryRecord
        if (!record) {
          return
        }

        if (record.timeEnd) {
          dispatch('finishTimer')
          timerObservable.stop()
        }
      })
    commit('SET_HISTORY_LISTENERS', { work: workListener })
  },
  setupBreakListener({
    rootGetters,
    dispatch,
    commit
  }) {
    const breakListener = firestore
      .collection('history')
      .where('ownerId', '==', rootGetters['authModule/userId'])
      .where('isBreak', '==', true)
      .onSnapshot(snapshot => {
        if (!snapshot.docChanges().length) {
          return
        }

        const breakDoc = snapshot.docChanges()[0].doc
        const record: HistoryRecord = {
          ...breakDoc.data() as Omit<HistoryRecord, 'id'>,
          id: breakDoc.id
        }
        commit('ADD_RECORD', record)

        dispatch('setupWorkListener')
        dispatch('setupRunner')

        timerObservable.stop()
      })

    commit('SET_HISTORY_LISTENERS', { break: breakListener })
  },
  clearTimer({ commit }) {
    commit('CLEAR_LISTENERS')
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
      const historyRecord: Omit<HistoryRecord, 'id'> = {
        isBreak: false,
        ownerId: rootGetters['authModule/userId'],
        timeStart: firebase.firestore.Timestamp.now(),
        timeEnd: null
      }

      await firestore
        .collection('history')
        .doc(recordId)
        .set(historyRecord)

      const record = { id: recordId, ...historyRecord }
      commit('ADD_RECORD', record)

      dispatch('setupRunner')
      dispatch('setupWorkListener')
      dispatch('setupBreakListener')

      return record
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  finishTimer({
    commit,
    getters,
    dispatch
  }): HistoryRecord {
    try {
      const timeEnd = firebase.firestore.Timestamp.now()

      commit('FINISH_RECORD', {
        recordId: getters.runningRecord.id,
        timeEnd
      })
      dispatch('clearTimer')

      return getters.runningRecord
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async resetTimer({
    commit,
    getters,
    dispatch
  }): Promise<void> {
    const runningRecord = getters.runningRecord
    if (!runningRecord) {
      throw new Error('Timer is not running')
    }

    commit('CLEAR_HISTORY_LISTENERS')
    try {
      const recordRef = firestore.collection('history').doc(runningRecord.id)
      await recordRef.delete()

      dispatch('clearTimer')

      commit('tasksModule/UNCOMPLETE_TASKS', runningRecord.timeStart, { root: true })
      commit('DELETE_RECORD', runningRecord.id)
    } catch (err) {
      console.error(err)
    }
  }
}

const getters: GetterTree<TimerState, RootState> = {
  historyFullness(state): boolean {
    return state.noMoreRecords
  },
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
    const start = dayjs(getters.runningRecord.timeStart.toDate())

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
