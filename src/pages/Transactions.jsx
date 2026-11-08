import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import { BangladeshiTaka, Search } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import { TransactionTable } from './AdminDashboard'
import { getCustomers, getShopName, subscribeCustomers, subscribeShopName } from '../data/store'
import { TypeAnimation } from 'react-type-animation'

const subscribe = (notify) => subscribeCustomers(notify)
const getSnapshot = () => getCustomers()
const subscribeShop = (notify) => subscribeShopName(notify)
const getShopSnapshot = () => getShopName()

export default function Transactions() {
  const customers = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const shopName = useSyncExternalStore(subscribeShop, getShopSnapshot, getShopSnapshot)
  const [search, setSearch] = useState('')
  const [shopNameRed, setShopNameRed] = useState(false)
  const toggleShopNameColor = useCallback(() => setShopNameRed((isRed) => !isRed), [])
  const shopNameSequence = useMemo(
    () => [shopName, 1000, '', toggleShopNameColor, 500],
    [shopName, toggleShopNameColor],
  )
  const transactions = useMemo(() => customers.flatMap((customer) => customer.history.map((item) => ({ ...item, customerName: customer.name, customerPhoto: customer.photo, customerId: customer.id }))).sort((a, b) => b.date.localeCompare(a.date)).filter((item) => !search || item.customerName.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase())), [customers, search])
  const collected = transactions.filter((item) => item.type === 'Payment').reduce((sum, item) => sum + item.amount, 0)
  const dues = transactions.filter((item) => item.type !== 'Payment').reduce((sum, item) => sum + item.amount, 0)

  return (
    <>
      <PageTitle title="Transactions" />
      <div className="page-heading">
        <div>
          <h1
            className="dashboard-shop-name"
            style={{ color: shopNameRed ? 'var(--red)' : 'var(--ink)' }}
          >
            <TypeAnimation
              sequence={shopNameSequence}
              speed={50}
              deletionSpeed={60}
              repeat={Infinity}
              cursor
            />
          </h1>
          <h1>Transactions<span className="heading-period">.</span></h1>
        </div>
      </div>
      <div className="transaction-summary">
        <div className="transaction-summary-card bg-[#DCE8F9]"><span className="summary-icon summary-green"><BangladeshiTaka /></span><span><h3>Total payments recorded</h3><strong>৳{collected.toLocaleString('en-BD')}</strong></span></div>
        <div className="transaction-summary-card bg-[#F5E6FC]"><span className="summary-icon summary-red"><BangladeshiTaka /></span><span><h3>Total dues recorded</h3><strong>৳{dues.toLocaleString('en-BD')}</strong></span></div>
      </div>
      <section className="panel activity-panel all-transactions">
        <div className="directory-toolbar transactions-toolbar"><div><h2>All transactions <span className="count-badge">{transactions.length}</span></h2><p>Newest activity appears first.</p></div><label className="search-control"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search activity..." /></label></div>
        <TransactionTable transactions={transactions} />
      </section>
    </>
  )
}
