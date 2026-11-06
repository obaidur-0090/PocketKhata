import { useMemo, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router'
import { BangladeshiTaka, BangladeshiTakaIcon, CircleHelp, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import LogoutConfirmation from '../components/LogoutConfirmation'
import PageTitle from '../components/PageTitle'
import { getCustomers, getShopName, subscribeCustomers, subscribeShopName } from '../data/store'
import PocketKhata from '../assets/PocketKhata.png'
import { TypeAnimation } from 'react-type-animation'

const subscribe = (notify) => subscribeCustomers(notify)
const getSnapshot = () => getCustomers()
const subscribeShop = (notify) => subscribeShopName(notify)
const getShopSnapshot = () => getShopName()
const balanceMoney = (value) => value < 0 ? `+৳${Math.abs(value).toLocaleString('en-BD')}` : `৳${value.toLocaleString('en-BD')}`
const paymentMethods = [
  { name: 'bKash', detail: 'Send Money', tone: 'bkash', logo: 'b' },
  { name: 'Nagad', detail: 'Send Money', tone: 'nagad', logo: 'n' },
  { name: 'Rocket', detail: 'Send Money', tone: 'rocket', logo: 'r' },
  { name: 'DBBL Bank', detail: 'Bank transfer', tone: 'dbbl', logo: 'd' },
]

export default function CustomerPortal() {
  const customers = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const shopName = useSyncExternalStore(subscribeShop, getShopSnapshot, getShopSnapshot)
  const { session, logout } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const shopNameSequence = useMemo(
    () => [shopName, 1000, '', 500],
    [shopName],
  )
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
      <header className="customer-topbar"><a href="/" className="brand-lockup"><span className="brand-mark"><img src={PocketKhata} alt="pocketKhata" /></span>
      <span className="text-3xl">Pocket<span className="text-red-500">KhaTa</span></span>
      
      </a>
      
      
      <div className="customer-header-right"><span className="secure-label"> Private customer view</span><button className="button button-subtle customer-logout" onClick={() => setLogoutOpen(true)}><LogOut size={15} /> Sign out</button></div></header>
      <main className="customer-content">
        <section className="customer-welcome"><div><h1
          className="dashboard-shop-name customer-shop-name"
        >
          <TypeAnimation
            sequence={shopNameSequence}
            speed={50}
            deletionSpeed={60}
            repeat={Infinity}
            cursor
          />
        </h1>
          <div className="flex items-center gap-5 mt-5">
            <span className="avatar customer-avatar customer-welcome-avatar avatar-1">{customer.photo ? <img src={customer.photo} alt={`${customer.name} profile`} /> : customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>

            <h2 className="font-bold">Hello, <span className="text-red-500" >{customer.name.split(' ')[0]}</span><span className="heading-period">. Welcome to <span className="text-red-500">PocketKhata.</span></span></h2>
          </div>
        </div>


        </section>


        <section className={`customer-balance-card ${customer.balance < 0 ? 'customer-credit-card' : ''}`}>
          <div className="balance-card-top"><div><span className="balance-card-label">{customer.balance < 0 ? 'আপনি দোকান থেকে পাবেন' : 'বকেয়া টাকার পরিমাণ'}</span><div className="big-balance">{balanceMoney(customer.balance)}</div></div><span className="balance-card-icon"></span></div><div className="balance-card-bottom"><span>Updated {new Date().toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>

        </section>


        <section className="customer-mini-stats"><div><span className="mini-stat-icon"><BangladeshiTaka size={19} /></span><span>Total Due<strong>৳{totalPurchases.toLocaleString('en-BD')}</strong></span></div><div><span className="mini-stat-icon mini-stat-green"><BangladeshiTakaIcon size={19} /></span><span>Total payments<strong>৳{totalPaid.toLocaleString('en-BD')}</strong></span></div><div><span className="mini-stat-icon mini-stat-blue"><BangladeshiTaka size={19} /></span><span>Transactions<strong>{String(customer.history.length).padStart(2, '0')}</strong></span></div></section>
        <div className="customer-dashboard-grid"><section className="panel customer-ledger"><div className="panel-heading"><div><span className="font-bold">ACCOUNT HISTORY</span><h2>Your transactions</h2></div>
        </div>
          {transactions.length ? <div className="ledger-list">{transactions.map((item) => <div className="ledger-item" key={item.id}><span className={`ledger-icon ${item.type === 'Payment' ? 'ledger-paid' : 'ledger-due'}`}>{item.type === 'Payment' ? <BangladeshiTaka size={19} /> : <BangladeshiTaka size={19} />}</span><span className="ledger-description"><strong>{item.type === 'Payment' ? 'Payment received' : 'Purchase on credit'}</strong><small>{new Date(`${item.date}T00:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</small></span><strong className={`ledger-amount ${item.type === 'Payment' ? 'ledger-amount-paid' : ''}`}>{item.type === 'Payment' ? '−' : '+'} ৳{item.amount.toLocaleString('en-BD')}</strong></div>)}</div> : <div className="empty-state">No transactions recorded yet.</div>}
        </section><section className="panel payment-panel"><div className="panel-heading"><div><h2>Payment options</h2></div></div><div className="payment-methods">{paymentMethods.map((method) => <button className="payment-method" key={method.name} onClick={() => toast.info(`Please ask your shop for their ${method.name} payment number.`)}><span className={`payment-logo ${method.tone}`}>{method.logo}</span><span><strong>{method.name}</strong><small>{method.detail}</small></span></button>)}</div><div className="payment-note"><CircleHelp size={15} /><span>After payment, share your transaction ID with the shop so they can update your balance.</span></div></section></div>
      </main>
      {logoutOpen && <LogoutConfirmation onCancel={() => setLogoutOpen(false)} onConfirm={handleLogout} busy={loggingOut} />}
    </div>
  )
}
