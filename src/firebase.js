import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim(),
)

const app = firebaseConfigured
  ? getApps().length ? getApp() : initializeApp(firebaseConfig)
  : null

export const auth = app ? getAuth(app) : null
export const googleProvider = auth ? new GoogleAuthProvider() : null
