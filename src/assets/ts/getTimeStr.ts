import { Time } from '@/assets/ts/secondsToTime'
import { checkSingleDigit } from '@/assets/ts/checkSingleDigit'

export type timeFormat = ':' | 'sw' | 'lw'
export function getTimeStr(time: Time, format: timeFormat): string {
  let res = ''
  if (time.hours) {
    res += `${checkSingleDigit(time.hours)}:`
  }
  if (time.minutes) {
    res += `${checkSingleDigit(time.minutes)}:`
  }
  res += `${checkSingleDigit(time.seconds)}`

  return res
}
