import { useMemo, useState, useSyncExternalStore } from 'react'
import { ArrowDownRight, ArrowUpRight, Search } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import { TransactionTable } from './AdminDashboard'
import { getCustomers, subscribeCustomers } from '../data/store'

const subscribe = (notify) => subscribeCustomers(notify)
const getSnapshot = () => getCustomers()

export default function Transactions() {
  const customers = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [search, setSearch] = useState('')
  const transactions = useMemo(() => customers.flatMap((customer) => customer.history.map((item) => ({ ...item, customerName: customer.name }))).sort((a, b) => b.date.localeCompare(a.date)).filter((item) => !search || item.customerName.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase())), [customers, search])
  const collected = transactions.filter((item) => item.type === 'Payment').reduce((sum, item) => sum + item.amount, 0)
  const dues = transactions.filter((item) => item.type !== 'Payment').reduce((sum, item) => sum + item.amount, 0)

  return (
    <>
      <PageTitle title="Transactions" />
      <div className="page-heading"><div><span className="eyebrow">LEDGER ACTIVITY</span><h1>Transactions<span className="heading-period">.</span></h1><p>A clear record of every payment and due added.</p></div></div>
      <div className="transaction-summary">
        <div className="transaction-summary-card"><span className="summary-icon summary-green"><ArrowDownRight size={18} /></span><span><small>Total payments recorded</small><strong>৳{collected.toLocaleString('en-BD')}</strong></span></div>
        <div className="transaction-summary-card"><span className="summary-icon summary-red"><ArrowUpRight size={18} /></span><span><small>Total dues recorded</small><strong>৳{dues.toLocaleString('en-BD')}</strong></span></div>
      </div>
      <section className="panel activity-panel all-transactions">
        <div className="directory-toolbar transactions-toolbar"><div><h2>All transactions <span className="count-badge">{transactions.length}</span></h2><p>Newest activity appears first.</p></div><label className="search-control"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search activity..." aria-label="Search transactions" /></label></div>
        <TransactionTable transactions={transactions} />
      </section>
    </>
  )
}
