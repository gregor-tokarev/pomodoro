export type taskStatus = 'todo' | 'completed'

export interface Task {
  id: string
  status: taskStatus
  text: string
  order: number
  ownerId: string
  timeCompleted?: string
}
