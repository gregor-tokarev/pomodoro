import * as functions from 'firebase-functions'
import { Task } from '../../../models/task.model'
import * as admin from 'firebase-admin'
import { UserDb } from '../auth/lib/user-db'

export const deleteTask = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(async (snapshot) => {
    const deletedTask = snapshot.data() as Omit<Task, 'id'>
    const {
      ownerId,
      order
    } = deletedTask

    const moreOrderTasks = await admin.firestore()
      .collection('tasks')
      .where('ownerId', '==', ownerId)
      .where('order', '>', order)
      .get()

    const queries = moreOrderTasks.docs.map((task) =>
      task.ref.update({ order: task.data().order - 1 }))

    return Promise.all(queries)
  })

export const decrementTasksCount = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(snapshot => {
    const ownerId: string = snapshot.data().ownerId

    const user = new UserDb(ownerId)
    return user.incrementCounter('tasks', -1)
  })

export const incrementTasksCount = functions.firestore
  .document('tasks/{taskId}')
  .onWrite((snapshot, context) => {
    const ownerId: string | undefined = context.auth?.uid
    if (!ownerId) return

    const user = new UserDb(ownerId)
    return user.incrementCounter('tasks', 1)
  })
