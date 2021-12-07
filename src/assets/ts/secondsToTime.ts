export interface Time {
  hours?: number;
  minutes?: number
  seconds: number
}

export function secondsToTime(seconds: number): Time {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  return {
    hours,
    minutes: minutes - hours * 60,
    seconds: seconds - minutes * 60
  }
}
