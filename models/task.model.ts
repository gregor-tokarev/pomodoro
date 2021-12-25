export type taskStatus = 'todo' | 'inprogress' | 'completed'

export interface Task {
  id: string
  status: taskStatus
  text: string
  order: number
  timeStart?: string
  timeEnd?: string
  ownerId: string
}
