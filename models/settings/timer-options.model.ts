export type breakTime = 5 | 15 | 30
export type workTime = 25 | 45 | 60

export interface TimerOptions {
  break: { time: breakTime }[],
  work: { time: workTime }[]
}
