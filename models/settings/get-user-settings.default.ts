import { defaultUserSettingsKeys, UserSettings } from './user-settings.model'

export function getUserSettings(
  settings: Omit<UserSettings, defaultUserSettingsKeys | 'id'>
): Omit<UserSettings, 'id'> {
  return {
    ownerId: settings.ownerId,
    breakTime: 5,
    workTime: 25
  }
}
