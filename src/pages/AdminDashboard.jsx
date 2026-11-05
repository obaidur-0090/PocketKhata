import { useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import { BangladeshiTaka, Plus, UsersRound, Wallet } from 'lucide-react'
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
  const transactions = customers.flatMap((customer) => customer.history.map((item) => ({ ...item, customerName: customer.name, customerPhoto: customer.photo, customerId: customer.id }))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const todayLabel = new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  return (
    <>
      <PageTitle title="Overview" />
      <div className="page-heading">
        <div><span className="eyebrow">{todayLabel}</span><h1 className="font-bold">Dash<span className="text-red-600">Board</span></h1><p>Here’s what’s happening with your business today.</p></div>
        <Link to="/admin/users" className="button button-primary"><Plus size={17} /> Add customer</Link>
      </div>
      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon red-tint"><Wallet size={19} /></span><span className="font-bold">Total due</span></div>
          <strong className="stat-value">{money(totalDue)}</strong>
          <span className="stat-decoration decoration-red"></span>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon green-tint"><BangladeshiTaka /></span><span className="font-bold">Collected this month</span></div>
          <strong className="stat-value">{money(totalCollected)}</strong>
          <span className="stat-decoration decoration-green"></span>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon blue-tint"><UsersRound size={19} /></span><span className="font-bold">All Time Total customers</span></div>
          <strong className="stat-value">{String(customers.length).padStart(2, '0')}</strong>
          <span className="stat-decoration decoration-blue"></span>
        </article>
      </section>
      <section className="dashboard-grid">
        <Suspense fallback={<div className="panel chart-panel chart-loading">Loading chart…</div>}><RectRecharts customers={customers} /></Suspense>
      
      </section>
      <section className="panel activity-panel">
        <div className="panel-heading activity-heading"><div><h2 className="md:text-2xl">Recent transactions</h2></div><Link className="text-link" to="/admin/transactions">View all</Link></div>
        <TransactionTable transactions={transactions} />
      </section>
    </>
  )
}

export function TransactionTable({ transactions }) {
  if (!transactions.length) return <div className="empty-state">No transactions yet. Add a customer or record a payment to get started.</div>
  return (
    <div className="table-scroll"><table className="data-table"><thead><tr><th>CUSTOMER</th><th>DATE</th><th>TYPE</th><th className="align-right">AMOUNT</th></tr></thead><tbody>
      {transactions.map((item) => <tr key={item.id}><td><div className="customer-cell transaction-customer-cell"><span className={`avatar customer-avatar avatar-${item.customerId?.length % 4 || 0}`}>{item.customerPhoto ? <img src={item.customerPhoto} alt={`${item.customerName} profile`} /> : item.customerName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong className="table-primary">{item.customerName}</strong><small className="table-secondary">Customer</small></span></div></td><td className="table-muted">{new Date(`${item.date}T00:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td><span className={`type-pill ${item.type === 'Payment' ? 'paid-pill' : 'due-pill'}`}>{item.type === 'Payment' ? 'Payment' : 'Due added'}</span></td><td className={`align-right amount-cell ${item.type === 'Payment' ? 'amount-paid' : ''}`}>{item.type === 'Payment' ? '− ' : '+ '}{money(item.amount)}</td></tr>)}
    </tbody></table></div>
  )
}
