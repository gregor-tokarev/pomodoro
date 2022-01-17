import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const deleteAccount = functions
  .auth
  .user()
  .onDelete(async user => {
    const userQuery = admin
      .firestore()
      .collection('users')
      .doc(user.uid)
    const userDoc = await userQuery.get()
    const userOperation = userDoc.ref.delete()

    const historyQuery = admin
      .firestore()
      .collection('history')
      .where('ownerId', '==', user.uid)
    const historyDocs = await historyQuery.get()
    const historyOperatings = historyDocs.docs.map(doc => doc.ref.delete())

    const tasksQuery = admin
      .firestore()
      .collection('tasks')
      .where('ownerId', '==', user.uid)
    const tasksDocs = await tasksQuery.get()
    const tasksOperations = tasksDocs.docs.map(doc => doc.ref.delete())

    const settingsQuery = admin
      .firestore()
      .collectionGroup('settings')
      .where('ownerId', '==', user.uid)
    const settingsDocs = await settingsQuery.get()
    const settingsOperations = settingsDocs.docs.map(doc => doc.ref.delete())

    return Promise.all([
      userOperation,
      ...historyOperatings,
      ...tasksOperations,
      ...settingsOperations
    ])
  })
