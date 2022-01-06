import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'
import { createSecludedTask, removeSecludedTask } from '../secludedTask'
// import { UserSettings } from '../../../models/settings/user-settings.model'

export const createRecord = functions.firestore
  .document('history/{recordId}')
  .onCreate(async (snapshot) => {
    // todo: setup seclusion dynamically by uncommented code below
    // const settingsRef = admin.firestore()
    //   .collectionGroup('settings')
    //   .where('ownerId', '==', snapshot.data().ownerId)
    // const settingsDoc = await settingsRef.get()
    // const settings = settingsDoc.docs[0].data() as UserSettings

    // const time = snapshot.data().isBreak ? settings.breakTime * 60 : settings.workTime * 60

    return createSecludedTask(
      snapshot.id,
      'https://europe-west-pomodoro-3b7d3.couldfunctions.net/historyFinish',
      60,
      // time,
      {
        recordId: snapshot.id
      }
    )
  })

export const deleteRecord = functions.firestore
  .document('history/{recordId}')
  .onDelete(async snapshot => {
    return removeSecludedTask(snapshot.id)
  })
