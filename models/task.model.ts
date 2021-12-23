export type taskStatus = 'todo' | 'inprogress' | 'completed'

export interface ITask {
  id: string
  status: taskStatus
  text: string
  order: number
  timeStart?: string
  timeEnd?: string
  ownerId: string
}
