import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './context'
const SESSION_KEY = 'pocketkhata-session-v1'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
    } catch (error) {
      console.error('Unable to restore the PocketKhata session.', error)
      return null
    }
  })

  const saveSession = useCallback((nextSession) => {
    setSession(nextSession)
    if (nextSession) localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    else localStorage.removeItem(SESSION_KEY)
  }, [])

  useEffect(() => {
    let unsubscribe
    import('../firebase').then(({ auth: firebaseAuth }) => {
      if (!firebaseAuth) return
      return import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      let savedSession = null
      try {
        savedSession = JSON.parse(localStorage.getItem(SESSION_KEY))
      } catch (error) {
        console.error('Unable to restore the PocketKhata session.', error)
      }
      if (!user) {
        if (savedSession?.firebase) saveSession(null)
        return
      }
      const currentRole = savedSession?.role || 'admin'
      if (currentRole === 'customer') return
      saveSession({ role: currentRole, email: user.email, name: user.displayName || user.email, firebase: true })
        })
      })
    }).catch((error) => {
      console.error('Unable to initialize Firebase authentication.', error)
    })
    return () => unsubscribe?.()
  }, [saveSession])

  async function adminLogin(email, password) {
    const { auth } = await import('../firebase')
    if (auth) {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const result = await signInWithEmailAndPassword(auth, email, password)
      saveSession({ role: 'admin', email: result.user.email, name: result.user.displayName || email, firebase: true })
      return
    }
    if (!email.trim() || !password) throw new Error('Enter your email and password.')
    saveSession({ role: 'admin', email, name: email.split('@')[0] })
  }

  async function adminSignup(name, email, password) {
    const { auth } = await import('../firebase')
    if (!auth) throw new Error('Add Firebase environment settings to enable secure admin account creation.')
    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    saveSession({ role: 'admin', email: result.user.email, name: name.trim() || email, firebase: true })
  }

  async function adminPasswordReset(email) {
    if (!email.trim()) throw new Error('Enter your email address first.')
    const { auth } = await import('../firebase')
    if (!auth) throw new Error('Password reset requires Firebase configuration.')
    const { sendPasswordResetEmail } = await import('firebase/auth')
    await sendPasswordResetEmail(auth, email.trim())
  }

  async function adminGoogleLogin() {
    const { auth, googleProvider } = await import('../firebase')
    if (!auth) throw new Error('Google sign-in requires Firebase configuration.')
    const { signInWithPopup } = await import('firebase/auth')
    const result = await signInWithPopup(auth, googleProvider)
    saveSession({
      role: 'admin',
      email: result.user.email,
      name: result.user.displayName || result.user.email,
      firebase: true,
    })
  }

  function customerUnlock(customer) {
    saveSession({ role: 'customer', name: customer.name, customerId: customer.id })
  }

  async function logout() {
    const { auth } = await import('../firebase')
    const { signOut } = await import('firebase/auth')
    if (auth && session?.firebase) await signOut(auth)
    saveSession(null)
  }

  const value = {
    session,
    adminLogin,
    adminSignup,
    adminPasswordReset,
    adminGoogleLogin,
    customerUnlock,
    logout,
    firebaseConfigured: Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_APP_ID),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
