import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { nanoid } from 'nanoid'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { createSecludedTask } from '../secludedTask'
import { settingsByUserId } from '../settingsByUserId'

dayjs.extend(utc)

export const finishRecord = functions.https
  .onRequest(async (req, res) => {
    const { recordId } = req.query as { [key: string]: string }

    const historyCollection = admin.firestore()
      .collection('history')

    const time = admin.firestore.Timestamp.now()

    const record = await historyCollection.doc(recordId).get()
    if (!record.exists) {
      return res.end()
    }

    await record
      .ref
      .update({
        timeEnd: time
      })

    const recordData = record.data()!
    if (!recordData.isBreak) {
      const settings = await settingsByUserId(recordData.ownerId)

      const breakId = nanoid()
      await historyCollection
        .doc(breakId)
        .set({
          ownerId: recordData.ownerId,
          isBreak: true,
          timeStart: time,
          timeEnd: null
        })

      const breakInSeconds = settings.breakTime * 60
      await createSecludedTask(
        breakId,
        `https://us-central1-pomodoro-3b7d3.cloudfunctions.net/finishRecord?recordId=${breakId}`,
        breakInSeconds
      )
    }

    res.end()
  })
