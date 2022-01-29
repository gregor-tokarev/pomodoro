import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { createSecludedTask, removeSecludedTask } from '../secludedTask'
import { settingsByUserId } from '../settingsByUserId'

export const createRecord = functions.firestore
  .document('history/{recordId}')
  .onCreate(async (snapshot) => {
    const settings = await settingsByUserId(snapshot.data().ownerId)
    const time = snapshot.data().isBreak ? settings.breakTime * 60 : settings.workTime * 60

    const changeCount = admin
      .firestore()
      .collection('users')
      .doc(snapshot.data().ownerId)
      .set({
        counters: {
          records: admin.firestore.FieldValue.increment(1)
        }
      }, { merge: true })

    return Promise.all([
      createSecludedTask(
        snapshot.id,
        `https://us-central1-pomodoro-3b7d3.cloudfunctions.net/finishRecord?recordId=${snapshot.id}`,
        time
      ),
      changeCount
    ])
  })

export const deleteRecord = functions.firestore
  .document('history/{recordId}')
  .onDelete(async snapshot => {
    if (!snapshot.data().timeEnd) {
      await removeSecludedTask(snapshot.id)
    }

    // uncomplete tasks
    const query = admin
      .firestore()
      .collection('tasks')
      .where('timeCompleted', '>', snapshot.data().timeStart)

    const changeCount = admin
      .firestore()
      .collection('users')
      .doc(snapshot.data().ownerId)
      .set({
        counters: {
          records: admin.firestore.FieldValue.increment(-1)
        }
      }, { merge: true })

    const tasksDocs = await query.get()
    const taskDeleteOperations = tasksDocs.docs.map(doc => doc.ref.update({
      status: 'todo',
      timeCompleted: null
    }))

    return Promise.all([...taskDeleteOperations, changeCount])
  })
