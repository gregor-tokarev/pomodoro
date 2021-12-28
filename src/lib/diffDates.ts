import dayjs, { OpUnitType, QUnitType } from 'dayjs'

export function diffDates(startDate?: string, endDate?: string, unit: QUnitType | OpUnitType = 'minutes'): number {
  return dayjs(endDate).diff(dayjs(startDate), unit)
}
