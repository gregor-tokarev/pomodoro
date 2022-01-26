export type timerEvents = 'timerStop' | 'timerReset' | 'timerStart' | 'timerUpdate'

export interface UpdateDetail {
  timeStr: string
  percent: number
}

class TimerObservable extends EventTarget {
  public unsubscribe(event: timerEvents, fn: EventListener): void {
    this.removeEventListener(event, fn)
  }

  public stop(): void {
    const event = new CustomEvent('timerStop')
    this.dispatchEvent(event)
  }

  public subscribeStop(fn: () => void): void {
    this.addEventListener('timerStop', fn)
  }

  public reset(): void {
    const event = new CustomEvent('timerReset')
    this.dispatchEvent(event)
  }

  public subscribeReset(fn: () => void): void {
    this.addEventListener('timerReset', fn)
  }

  public update(detail: UpdateDetail): void {
    const event = new CustomEvent<UpdateDetail>('timerUpdate', {
      detail
    })
    this.dispatchEvent(event)
  }

  public subscribeUpdate(fn: (event: CustomEventInit<UpdateDetail>) => void): void {
    this.addEventListener('timerUpdate', fn)
  }
}

export const timerObservable = new TimerObservable()
