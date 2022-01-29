export type timerEvents =
  'timerStop'
  | 'timerReset'
  | 'timerStart'
  | 'timerUpdate'
  | 'timerSwitch'

export interface UpdateDetail {
  timeStr: string
  percent: number
}

class TimerObservable extends EventTarget {
  public unsubscribe(event: timerEvents, fn: EventListener): void {
    this.removeEventListener(event, fn)
  }

  public dispatch<T = any>(eventName: timerEvents, payload?: T): void {
    const event = new CustomEvent<T>(eventName, { detail: payload })
    this.dispatchEvent(event)
  }

  public subscribe(eventName: timerEvents, fn: EventListener): void {
    this.addEventListener(eventName, fn)
  }
}

export const timerObservable = new TimerObservable()
