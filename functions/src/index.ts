import * as admit from 'firebase-admin'

admit.initializeApp()
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request: Request, response: Response) => {
//   functions.logger.info('Hello logs!', { structuredData: true })
// })

export * from './auth'
export * from './tasks'
export * from './history'
