import { breakTime, workTime } from './timer-options.model'

export type defaultUserSettingsKeys = 'workTime' | 'breakTime'
export interface UserSettings {
  id: string
  ownerId: string
  workTime: workTime
  breakTime: breakTime
}
