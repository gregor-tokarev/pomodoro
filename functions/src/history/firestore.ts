import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { createSecludedTask, removeSecludedTask } from '../secludedTask'
import { UserDb } from '../auth/lib/user-db'

export const createRecord = functions.firestore
  .document('history/{recordId}')
  .onCreate(async (snapshot) => {
    const user = new UserDb(snapshot.data().ownerId)
    const settings = await user.fetchUserSettings()
    const time = snapshot.data().isBreak ? settings.breakTime * 60 : settings.workTime * 60

    return Promise.all([
      createSecludedTask(
        snapshot.id,
        `https://us-central1-pomodoro-3b7d3.cloudfunctions.net/finishRecord?recordId=${snapshot.id}`,
        time
      )
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

    const tasksDocs = await query.get()
    const taskDeleteOperations = tasksDocs.docs.map(doc => doc.ref.update({
      status: 'todo',
      timeCompleted: null
    }))

    return Promise.all(taskDeleteOperations)
  })

export const decrementRecordsCount = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(snapshot => {
    if (!snapshot.data().timeEnd) return
    const ownerId: string = snapshot.data().ownerId

    const user = new UserDb(ownerId)
    return user.incrementCounter('tasks', -1)
  })
