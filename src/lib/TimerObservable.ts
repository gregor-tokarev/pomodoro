export type timerEvents = 'timerStop' | 'timerReset' | 'timerStart'

class TimerObservable extends EventTarget {
  public unsubscribe(event: timerEvents, fn: () => void): void {
    this.removeEventListener(event, fn)
  }

  public stop(): void {
    const event = new Event('timerStop')
    this.dispatchEvent(event)
  }

  public subscribeStop(fn: () => void): void {
    this.addEventListener('timerStop', fn)
  }

  public reset(): void {
    const event = new Event('timerReset')
    this.dispatchEvent(event)
  }

  public subscribeReset(fn: () => void): void {
    this.addEventListener('timerReset', fn)
  }
}

export const timerObservable = new TimerObservable()
