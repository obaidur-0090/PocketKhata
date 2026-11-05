import { useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CircleDollarSign, Plus, UsersRound, Wallet, WalletCards } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import { getCustomers, subscribeCustomers } from '../data/store'
import { lazy, Suspense } from 'react'

const RectRecharts = lazy(() => import('./RectRecharts'))

const money = (value) => `৳${Number(value).toLocaleString('en-BD')}`
const subscribe = (notify) => subscribeCustomers(notify)
const getSnapshot = () => getCustomers()

export default function AdminDashboard() {
  const customers = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const totalDue = customers.reduce((sum, customer) => sum + Math.max(0, customer.balance), 0)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const totalCollected = customers.reduce((sum, customer) => sum + customer.history.filter((item) => {
    const date = new Date(`${item.date}T00:00:00`)
    return item.type === 'Payment' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).reduce((value, item) => value + item.amount, 0), 0)
  const transactions = customers.flatMap((customer) => customer.history.map((item) => ({ ...item, customerName: customer.name }))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const todayLabel = new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  return (
    <>
      <PageTitle title="Overview" />
      <div className="page-heading">
        <div><span className="eyebrow">{todayLabel}</span><h1>Good afternoon<span className="heading-period">.</span></h1><p>Here’s what’s happening with your business today.</p></div>
        <Link to="/admin/users" className="button button-primary"><Plus size={17} /> Add customer</Link>
      </div>
      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon red-tint"><Wallet size={19} /></span><span className="stat-trend trend-up"><ArrowUpRight size={14} /> 8.2%</span></div>
          <span className="stat-label">Total outstanding</span><strong className="stat-value">{money(totalDue)}</strong><span className="stat-caption">Across all customers</span>
          <span className="stat-decoration decoration-red"><CircleDollarSign size={68} /></span>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon green-tint"><ArrowDownRight size={19} /></span><span className="stat-trend trend-up"><ArrowUpRight size={14} /> 12.5%</span></div>
          <span className="stat-label">Collected this month</span><strong className="stat-value">{money(totalCollected)}</strong><span className="stat-caption">Payments recorded this month</span>
          <span className="stat-decoration decoration-green"><CircleDollarSign size={68} /></span>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon blue-tint"><UsersRound size={19} /></span><span className="stat-period">All time</span></div>
          <span className="stat-label">Total customers</span><strong className="stat-value">{String(customers.length).padStart(2, '0')}</strong><span className="stat-caption">Your customer directory</span>
          <span className="stat-decoration decoration-blue"><UsersRound size={68} /></span>
        </article>
      </section>
      <section className="dashboard-grid">
        <Suspense fallback={<div className="panel chart-panel chart-loading">Loading chart…</div>}><RectRecharts customers={customers} /></Suspense>
        <article className="panel quick-panel">
          <div className="panel-heading"><div><span className="eyebrow">QUICK ACTIONS</span><h2>Make it happen</h2></div></div>
          <Link className="quick-action" to="/admin/users"><span className="quick-icon quick-red"><UsersRound size={19} /></span><span><strong>Add a customer</strong><small>Create a customer profile</small></span><ArrowRight size={17} /></Link>
          <Link className="quick-action" to="/admin/users"><span className="quick-icon quick-gold"><WalletCards size={19} /></span><span><strong>Record a payment</strong><small>Update a customer balance</small></span><ArrowRight size={17} /></Link>
          <Link className="quick-action" to="/admin/transactions"><span className="quick-icon quick-green"><ArrowDownRight size={19} /></span><span><strong>View transactions</strong><small>See your latest activity</small></span><ArrowRight size={17} /></Link>
          <div className="tip-card"><div className="tip-spark">✳</div><div><strong>Small tip</strong><p>Share each customer’s unique key so they can check their balance anytime.</p></div></div>
        </article>
      </section>
      <section className="panel activity-panel">
        <div className="panel-heading activity-heading"><div><span className="eyebrow">LATEST ACTIVITY</span><h2>Recent transactions</h2></div><Link className="text-link" to="/admin/transactions">View all <ArrowRight size={15} /></Link></div>
        <TransactionTable transactions={transactions} />
      </section>
    </>
  )
}

export function TransactionTable({ transactions }) {
  if (!transactions.length) return <div className="empty-state">No transactions yet. Add a customer or record a payment to get started.</div>
  return (
    <div className="table-scroll"><table className="data-table"><thead><tr><th>TRANSACTION</th><th>CUSTOMER</th><th>DATE</th><th>TYPE</th><th className="align-right">AMOUNT</th></tr></thead><tbody>
      {transactions.map((item) => <tr key={item.id}><td><span className={`transaction-icon ${item.type === 'Payment' ? 'transaction-paid' : 'transaction-due'}`}>{item.type === 'Payment' ? <ArrowDownRight size={15} /> : <CircleDollarSign size={15} />}</span></td><td><strong className="table-primary">{item.customerName}</strong><small className="table-secondary">Customer</small></td><td className="table-muted">{new Date(`${item.date}T00:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td><span className={`type-pill ${item.type === 'Payment' ? 'paid-pill' : 'due-pill'}`}>{item.type === 'Payment' ? 'Payment' : 'Due added'}</span></td><td className={`align-right amount-cell ${item.type === 'Payment' ? 'amount-paid' : ''}`}>{item.type === 'Payment' ? '− ' : '+ '}{money(item.amount)}</td></tr>)}
    </tbody></table></div>
  )
}
