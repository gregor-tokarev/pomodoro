import firebase from 'firebase/compat'

export type taskStatus = 'todo' | 'completed'

export interface Task {
  id: string
  status: taskStatus
  text: string
  order: number
  ownerId: string
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
  timeCompleted: firebase.firestore.Timestamp | null
}
