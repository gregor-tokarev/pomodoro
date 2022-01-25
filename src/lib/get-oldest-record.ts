import { HistoryRecord } from '../../models/history-record.model'

export function getOldestRecord(records: HistoryRecord[]): HistoryRecord | undefined {
  const recordStarts = records.map(record => record.timeStart.seconds)
  const minStart = Math.min(...recordStarts)

  return records.find(record => record.timeStart.seconds === minStart)
}
