import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import { findCustomerByKey } from '../data/store'
import PageTitle from '../components/PageTitle'
import PocketKhata from '../assets/PocketKhata.png'
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
      <Link to="/" className="auth-back"><ArrowLeft size={25} /><span className="md:text-xl">Back to home</span></Link>
      <div className="auth-card">
        <Link to="/" className="brand-lockup auth-brand"><span className="brand-mark "><img src={PocketKhata} alt="" /></span><span className='text-2xl'>Pocket<span className="brand-accent">KhaTa</span></span></Link>
        <h1>CUSTOMER PORTAL</h1>
        <p className="auth-description">Enter the private access key shared by your shop to view your account.</p>
        <form className="auth-form" onSubmit={unlock}>
          <label>8-digit customer key<input required inputMode="numeric" pattern="[0-9]{8}" maxLength={8} value={key} onChange={(event) => setKey(event.target.value.replace(/\D/g, ''))} placeholder="24816357" /></label>
          <button type="submit" className="button button-primary auth-submit">View my account</button>
        </form>
      </div>
    </div>
  )
}
