import { useMemo, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router'
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, CircleHelp, LogOut, ShieldCheck, WalletCards } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import LogoutConfirmation from '../components/LogoutConfirmation'
import PageTitle from '../components/PageTitle'
import { getCustomers, subscribeCustomers } from '../data/store'

const subscribe = (notify) => subscribeCustomers(notify)
const getSnapshot = () => getCustomers()
const paymentMethods = [
  { name: 'bKash', detail: 'Send Money', tone: 'bkash', logo: 'b' },
  { name: 'Nagad', detail: 'Send Money', tone: 'nagad', logo: 'n' },
  { name: 'Rocket', detail: 'Send Money', tone: 'rocket', logo: 'r' },
  { name: 'DBBL Bank', detail: 'Bank transfer', tone: 'dbbl', logo: 'd' },
]

export default function CustomerPortal() {
  const customers = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const { session, logout } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const customer = customers.find((entry) => entry.id === session?.customerId)
  const transactions = useMemo(() => customer?.history.slice().sort((a, b) => b.date.localeCompare(a.date)) || [], [customer])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/customer/login')
    } catch (error) {
      toast.error(error.message || 'Unable to sign out. Please try again.')
    } finally {
      setLoggingOut(false)
      setLogoutOpen(false)
    }
  }

  if (!customer) {
    return <div className="auth-page"><PageTitle title="Account unavailable" /><div className="auth-card"><span className="auth-icon"><CircleHelp size={20} /></span><h1>Account not found</h1><p className="auth-description">This customer record is no longer available. Please ask your shop for help.</p><button className="button button-primary auth-submit" onClick={() => setLogoutOpen(true)}>Return to login</button></div>{logoutOpen && <LogoutConfirmation onCancel={() => setLogoutOpen(false)} onConfirm={handleLogout} busy={loggingOut} />}</div>
  }

  const totalPurchases = customer.history.filter((item) => item.type !== 'Payment').reduce((sum, item) => sum + item.amount, 0)
  const totalPaid = customer.history.filter((item) => item.type === 'Payment').reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="customer-portal">
      <PageTitle title="My account" />
      <header className="customer-topbar"><a href="/" className="brand-lockup"><span className="brand-mark"><WalletCards size={21} /></span><span>Pocket<span className="brand-accent">Khata</span><small>SMART LEDGER</small></span></a><div className="customer-header-right"><span className="secure-label"><ShieldCheck size={15} /> Private customer view</span><button className="button button-subtle customer-logout" onClick={() => setLogoutOpen(true)}><LogOut size={15} /> Sign out</button></div></header>
      <main className="customer-content">
        <section className="customer-welcome"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>Hello, {customer.name.split(' ')[0]}<span className="heading-period">.</span></h1><p>Here’s a clear view of your account with your shop.</p></div><span className="avatar customer-avatar customer-welcome-avatar avatar-1">{customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span></section>
        <section className="customer-balance-card"><div className="balance-card-top"><div><span className="balance-card-label">YOUR OUTSTANDING BALANCE</span><div className="big-balance">৳{customer.balance.toLocaleString('en-BD')}</div></div><span className="balance-card-icon"><WalletCards size={23} /></span></div><div className="balance-card-bottom"><span><span className="balance-status-dot" /> {customer.balance === 0 ? 'You’re all settled up' : 'Amount due to your shop'}</span><span>Updated {new Date().toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div></section>
        <section className="customer-mini-stats"><div><span className="mini-stat-icon"><ArrowUpRight size={16} /></span><span><small>Total purchases</small><strong>৳{totalPurchases.toLocaleString('en-BD')}</strong></span></div><div><span className="mini-stat-icon mini-stat-green"><ArrowDownLeft size={16} /></span><span><small>Total payments</small><strong>৳{totalPaid.toLocaleString('en-BD')}</strong></span></div><div><span className="mini-stat-icon mini-stat-blue"><ArrowLeftRight size={16} /></span><span><small>Transactions</small><strong>{String(customer.history.length).padStart(2, '0')}</strong></span></div></section>
        <div className="customer-dashboard-grid"><section className="panel customer-ledger"><div className="panel-heading"><div><span className="eyebrow">ACCOUNT HISTORY</span><h2>Your transactions</h2></div><span className="read-only-badge"><ShieldCheck size={13} /> View only</span></div>
          {transactions.length ? <div className="ledger-list">{transactions.map((item) => <div className="ledger-item" key={item.id}><span className={`ledger-icon ${item.type === 'Payment' ? 'ledger-paid' : 'ledger-due'}`}>{item.type === 'Payment' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</span><span className="ledger-description"><strong>{item.type === 'Payment' ? 'Payment received' : 'Purchase on credit'}</strong><small>{new Date(`${item.date}T00:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</small></span><strong className={`ledger-amount ${item.type === 'Payment' ? 'ledger-amount-paid' : ''}`}>{item.type === 'Payment' ? '−' : '+'} ৳{item.amount.toLocaleString('en-BD')}</strong></div>)}</div> : <div className="empty-state">No transactions recorded yet.</div>}
        </section><section className="panel payment-panel"><div className="panel-heading"><div><span className="eyebrow">SETTLE YOUR DUE</span><h2>Payment options</h2></div></div><p className="payment-intro">Choose a convenient way to pay. Please confirm payment details with your shop before sending.</p><div className="payment-methods">{paymentMethods.map((method) => <button className="payment-method" key={method.name} onClick={() => toast.info(`Please ask your shop for their ${method.name} payment number.`)}><span className={`payment-logo ${method.tone}`}>{method.logo}</span><span><strong>{method.name}</strong><small>{method.detail}</small></span><ArrowDownLeft size={16} /></button>)}</div><div className="payment-note"><CircleHelp size={15} /><span>After payment, share your transaction ID with the shop so they can update your balance.</span></div></section></div>
        <footer className="customer-footer"><span><ShieldCheck size={14} /> Your account details are private and read-only.</span><span>Need help? Contact your shop directly.</span></footer>
      </main>
      {logoutOpen && <LogoutConfirmation onCancel={() => setLogoutOpen(false)} onConfirm={handleLogout} busy={loggingOut} />}
    </div>
  )
}
