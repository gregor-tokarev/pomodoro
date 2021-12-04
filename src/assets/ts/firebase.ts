import firebase from 'firebase/compat'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const functions = firebase.functions()

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  firestore.useEmulator('localhost', 8081)
  auth.useEmulator('https://locahost:9099')
  storage.useEmulator('locahost', 9199)
  functions.useEmulator('locahost', 5001)
}
export { firestore, auth, storage, functions }
