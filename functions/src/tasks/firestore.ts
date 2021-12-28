import * as functions from 'firebase-functions'
import { Task } from '../../../models/task.model'
import * as admit from 'firebase-admin'

export const deleteTask = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(async (snapshot) => {
    const deletedTask = snapshot.data() as Omit<Task, 'id'>
    const {
      ownerId,
      order
    } = deletedTask

    const moreOrderTasks = await admit.firestore()
      .collection('tasks')
      .where('ownerId', '==', ownerId)
      .where('order', '>', order)
      .get()

    const queries = moreOrderTasks.docs.map((task) =>
      task.ref.update({ order: task.data().order - 1 }))

    return Promise.all(queries)
  })
