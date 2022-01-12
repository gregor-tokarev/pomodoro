import { UserSettings } from '../../models/settings/user-settings.model'
import * as admin from 'firebase-admin'

export async function settingsByUserId(ownerId: string): Promise<UserSettings> {
  const settingsRef = admin.firestore()
    .collectionGroup('settings')
    .where('ownerId', '==', ownerId)

  const settingsDoc = await settingsRef.get()
  return settingsDoc.docs[0].data() as UserSettings
}
