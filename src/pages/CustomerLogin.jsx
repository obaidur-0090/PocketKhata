import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, KeyRound, WalletCards } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import { findCustomerByKey } from '../data/store'
import PageTitle from '../components/PageTitle'

export default function CustomerLogin() {
  const [key, setKey] = useState('')
  const { customerUnlock } = useAuth()
  const navigate = useNavigate()

  async function unlock(event) {
    event.preventDefault()
    const customer = findCustomerByKey(key.trim())
    if (!customer) {
      toast.error('No customer account matches this 8-digit access key.')
      return
    }
    customerUnlock(customer)
    navigate('/customer')
  }

  return (
    <div className="auth-page customer-auth">
      <PageTitle title="Customer login" />
      <Link to="/" className="auth-back"><ArrowLeft size={16} /> Back to home</Link>
      <div className="auth-card">
        <Link to="/" className="brand-lockup auth-brand"><span className="brand-mark"><WalletCards size={21} /></span><span>Pocket<span className="brand-accent">Khata</span><small>SMART LEDGER</small></span></Link>
        <div className="auth-icon"><KeyRound size={20} /></div>
        <span className="eyebrow">CUSTOMER PORTAL</span>
        <h1>Your account, in view.</h1>
        <p className="auth-description">Enter the private access key shared by your shop to view your account.</p>
        <form className="auth-form" onSubmit={unlock}>
          <label>8-digit customer key<input required inputMode="numeric" pattern="[0-9]{8}" maxLength={8} value={key} onChange={(event) => setKey(event.target.value.replace(/\D/g, ''))} placeholder="e.g. 24816357" /></label>
          <button type="submit" className="button button-primary auth-submit">View my account <ArrowRight size={17} /></button>
        </form>
        <div className="auth-safe"><span /> Your account is view-only and private</div>
      </div>
    </div>
  )
}
