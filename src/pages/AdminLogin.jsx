import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import PageTitle from '../components/PageTitle'
import PocketKhata from '../assets/PocketKhata.png'
export default function AdminLogin() {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const { adminLogin, adminSignup, adminPasswordReset, adminGoogleLogin, firebaseConfigured } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      if (isSignup) await adminSignup(form.name, form.email, form.password)
      else await adminLogin(form.email, form.password)
      toast.success(isSignup ? 'Admin account created.' : 'Welcome back.')
      navigate('/admin')
    } catch (error) {
      toast.error(error.message || 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePasswordReset() {
    setBusy(true)
    try {
      await adminPasswordReset(form.email)
      toast.success('Check your mail for changing password')
    } catch (error) {
      toast.error(error.message || 'Unable to send password reset email.')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogleLogin() {
    setBusy(true)
    try {
      await adminGoogleLogin()
      toast.success('Welcome back.')
      navigate('/admin')
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <PageTitle title={isSignup ? 'Create admin account' : 'Admin sign in'} />
      <Link to="/" className="auth-back"><ArrowLeft size={25} /><span className="md:text-xl"> Back to home</span></Link>
      <div className="auth-card">
        <Link to="/" className="brand-lockup auth-brand">
          <span className="brand-mark"><img src={PocketKhata} alt="" /></span>
          <span>Pocket<span className="brand-accent">Khata</span></span>
        </Link>
        <h1>{isSignup ? 'Create your account' : 'ADMIN PORTAL'}</h1>
        <p className="auth-description">{isSignup ? 'Set up an administrator account for your business.' : 'Sign in to manage your customer ledger.'}</p>
        {!firebaseConfigured && <div className="demo-notice">Demo mode is active. Configure Firebase to enable secure, shared admin accounts.</div>}
        {!isSignup && <>
          <button type="button" className="button button-google" disabled={!firebaseConfigured || busy} onClick={handleGoogleLogin}><span className="google-g">G</span> {busy ? 'Connecting…' : 'Continue with Google'}</button>
          {!firebaseConfigured && <p className="google-hint">Google login becomes available when Firebase is configured.</p>}
          <div className="form-divider"><span>or sign in with email</span></div>
        </>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && <label>Full name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>}
          <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@business.com" /></label>
          <label>Password<div className="password-wrap"><input aria-label="Password" required minLength={6} type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /><button type="button" aria-label="Toggle visibility" onClick={() => setShowPassword((show) => !show)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {!isSignup && <button type="button" className="auth-forgot" disabled={busy} onClick={handlePasswordReset}>Forgot password?</button>}
          <button type="submit" className="button button-primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create admin account' : 'Sign in to dashboard'}</button>
        </form>
        <div className="auth-switch">{isSignup ? 'Already have an account?' : 'New to PocketKhata?'} <button type="button" onClick={() => setIsSignup((value) => !value)}>{isSignup ? 'Sign in' : 'Create an admin account'}</button></div>
      </div>
    </div>
  )
}
