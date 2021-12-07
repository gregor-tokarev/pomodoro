import dayjs, { OpUnitType, QUnitType } from 'dayjs'

export function diffDates(startDate: string, endDate: string, unit: QUnitType | OpUnitType): number {
  return dayjs(endDate).diff(dayjs(startDate), unit)
}
