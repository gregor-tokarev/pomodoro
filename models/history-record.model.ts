export interface HistoryRecord {
  id: string
  timeStart: string
  timeEnd: string | null
  isBreak: boolean
  ownerId: string
}
