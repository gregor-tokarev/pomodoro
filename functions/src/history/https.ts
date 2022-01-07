import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as dayjs from 'dayjs'

export const finishRecord = functions.https
  .onRequest(async (req, res) => {
    const { recordId } = req.query as {[key: string]: string}

    await admin.firestore()
      .collection('history')
      .doc(recordId)
      .update({
        timeEnd: dayjs().format()
      })

    res.end()
  })
