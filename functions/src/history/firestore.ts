import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { createSecludedTask, removeSecludedTask } from '../secludedTask'
import { UserSettings } from '../../../models/settings/user-settings.model'

export const createRecord = functions.firestore
  .document('history/{recordId}')
  .onCreate(async (snapshot) => {
    const settingsRef = admin.firestore()
      .collectionGroup('settings')
      .where('ownerId', '==', snapshot.data().ownerId)
    const settingsDoc = await settingsRef.get()
    const settings = settingsDoc.docs[0].data() as UserSettings

    const time = snapshot.data().isBreak ? settings.breakTime * 60 : settings.workTime * 60

    return createSecludedTask(
      snapshot.id,
      `https://us-central1-pomodoro-3b7d3.cloudfunctions.net/finishRecord?recordId=${snapshot.id}`,
      time
    )
  })

export const deleteRecord = functions.firestore
  .document('history/{recordId}')
  .onDelete(snapshot => {
    return removeSecludedTask(snapshot.id)
  })
