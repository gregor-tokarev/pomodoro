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

if (process.env.NODE_ENV === 'development') {
  firestore.useEmulator('localhost', 8081)
  auth.useEmulator('http://localhost:9099')
  storage.useEmulator('localhost', 9199)
  functions.useEmulator('localhost', 5001)
}

const analytics = firebase.analytics()

export { firestore, auth, storage, functions, analytics }
