import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(utc)

export const finishRecord = functions.https
  .onRequest(async (req, res) => {
    const { recordId } = req.query as {[key: string]: string}

    await admin.firestore()
      .collection('history')
      .doc(recordId)
      .update({
        timeEnd: dayjs().utc().format()
      })

    res.end()
  })
