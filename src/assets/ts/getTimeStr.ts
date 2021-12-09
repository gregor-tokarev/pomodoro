import { Time } from '@/assets/ts/secondsToTime'
import { checkSingleDigit } from '@/assets/ts/checkSingleDigit'

export function getTimeStr(time: Time): string {
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
