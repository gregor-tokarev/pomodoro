import firebase from 'firebase/compat'

export interface HistoryRecord {
  id: string
  timeStart: firebase.firestore.Timestamp
  timeEnd: firebase.firestore.Timestamp | null
  isBreak: boolean
  ownerId: string
}
