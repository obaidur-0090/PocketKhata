import { useMemo, useState, useSyncExternalStore } from 'react'
import { BangladeshiTaka, Check, ChevronDown, Clock3, Copy, Edit3, Ellipsis, Filter, ImagePlus, KeyRound, Plus, Search, Trash2, UsersRound, X } from 'lucide-react'
import { toast } from 'react-toastify'
import PageTitle from '../components/PageTitle'
import { addTransaction, createCustomer, deleteCustomer, getCustomers, subscribeCustomers, updateCustomer, updateTransaction } from '../data/store'

const money = (value) => `৳${Number(value).toLocaleString('en-BD')}`
const balanceMoney = (value) => value < 0 ? `+${money(Math.abs(value))}` : money(value)
const subscribe = (notify) => subscribeCustomers(notify)
const getSnapshot = () => getCustomers()
const today = () => {
  const date = new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export default function User() {
  const customers = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [historyCustomer, setHistoryCustomer] = useState(null)
  const [menuFor, setMenuFor] = useState(null)
  const [form, setForm] = useState(emptyCustomer())
  const [transaction, setTransaction] = useState({ type: 'Payment', amount: '', date: today() })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || [customer.name, customer.phone, customer.location].some((value) => value.toLowerCase().includes(term))
    const matchesAmount = filter === 'all' || (filter === 'low' ? customer.balance <= 5000 : customer.balance > 5000)
    return matchesSearch && matchesAmount
  }), [customers, search, filter])
  const totalDue = customers.reduce((sum, customer) => sum + Math.max(0, customer.balance), 0)
  const totalCredit = customers.reduce((sum, customer) => sum + Math.max(0, -customer.balance), 0)
  const activeHistoryCustomer = historyCustomer
    ? customers.find((customer) => customer.id === historyCustomer.id)
    : null
  const editedTransaction = modal === 'edit-transaction' ? selected?.history?.find((item) => item.id === transaction.id) : null
  const transactionImpact = transaction.type === 'Payment' ? -Number(transaction.amount) : Number(transaction.amount)
  const previousTransactionImpact = editedTransaction ? (editedTransaction.type === 'Payment' ? -editedTransaction.amount : editedTransaction.amount) : 0
  const transactionBalance = selected && Number(transaction.amount) > 0
    ? selected.balance + transactionImpact - previousTransactionImpact
    : null

  function openCreate() {
    setForm(emptyCustomer())
    setModal('create')
  }

  function openEdit(customer) {
    setSelected(customer)
    setForm({ name: customer.name, phone: customer.phone, location: customer.location, balance: customer.balance, date: today(), photo: customer.photo || '' })
    setMenuFor(null)
    setModal('edit')
  }

  async function selectCustomerPhoto(event) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file for the customer photo.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Choose an image smaller than 10 MB.')
      return
    }
    try {
      const photo = await optimizeCustomerPhoto(file)
      setForm((current) => ({ ...current, photo }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  function openTransaction(customer) {
    setSelected(customer)
    setTransaction({ type: 'Payment', amount: '', date: today() })
    setMenuFor(null)
    setModal('transaction')
  }

  function openHistory(customer) {
    setHistoryCustomer(customer)
    setMenuFor(null)
  }

  async function copyCustomerValue(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label} copied.`)
    } catch (error) {
      console.error(`Unable to copy customer ${label.toLowerCase()}.`, error)
      toast.error(`Could not copy ${label.toLowerCase()}. Check browser clipboard permissions.`)
    }
  }

  function saveCustomer(event) {
    event.preventDefault()
    try {
      if (modal === 'create') {
        const customer = createCustomer(form)
        toast.success(`Customer added. Access key: ${customer.accessKey}`)
      } else {
        updateCustomer(selected.id, { name: form.name.trim(), phone: form.phone.trim(), location: form.location.trim(), balance: Number(form.balance), photo: form.photo })
        toast.success('Customer details updated.')
      }
      setModal(null)
    } catch (error) {
      toast.error(error.message)
    }
  }

  function saveTransaction(event) {
    event.preventDefault()
    const amount = Number(transaction.amount)
    if (!amount || amount < 0) {
      toast.error('Enter an amount greater than zero.')
      return
    }
    try {
      addTransaction(selected.id, { ...transaction, amount })
      toast.success(`${transaction.type === 'Payment' ? 'Payment' : 'New due'} recorded.`)
      setModal(null)
    } catch (error) {
      toast.error(error.message)
    }
  }

  function openEditTransaction(customer, item) {
    setSelected(customer)
    setTransaction({ id: item.id, type: item.type, amount: String(item.amount), date: item.date })
    setHistoryCustomer(null)
    setModal('edit-transaction')
  }

  function saveEditedTransaction(event) {
    event.preventDefault()
    try {
      updateTransaction(selected.id, transaction.id, transaction)
      toast.success('Transaction updated.')
      setModal(null)
      setHistoryCustomer(getCustomers().find((customer) => customer.id === selected.id))
    } catch (error) {
      toast.error(error.message)
    }
  }

  function removeCustomer() {
    try {
      deleteCustomer(confirmDelete.id)
      toast.success(`${confirmDelete.name} removed from your customers.`)
      setConfirmDelete(null)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <PageTitle title="Customers" />
      <div className="page-heading user-page-heading">
        <div><h1 className=" font-bold">Custo<span className="text-red-600">Mers</span></h1></div>
        <button type="button" className="button button-primary" onClick={openCreate}><Plus size={17} /> Add customer</button>
      </div>
      <section className="user-summary-grid">
        <div className="user-summary-card"><span className="summary-icon summary-red"><UsersRound size={18} /></span><div><small>Total customers</small><strong>{String(customers.length).padStart(2, '0')}</strong></div></div>
        <div className="user-summary-card"><span className="summary-icon summary-orange"><BangladeshiTaka /></span><div><small>Total Due</small><strong>{money(totalDue)}</strong></div></div>
        <div className="user-summary-card"><span className="summary-icon summary-green"><BangladeshiTaka /></span><div><small>Total customer credit</small><strong>{money(totalCredit)}</strong></div></div>
      </section>
      <section className="panel directory-panel">
        <div className="directory-toolbar">
          <div><h2>All customers <span className="count-badge">{customers.length}</span></h2><p>A complete list of your customer accounts.</p></div>
          <div className="directory-controls">
            <label className="search-control"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers..." aria-label="Search customers" /><Search /></label>
            <label className="filter-control"><Filter size={15} /><select aria-label="Filter by balance" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All balances</option><option value="low">Low · up to ৳5,000</option><option value="high">High · above ৳5,000</option></select><ChevronDown size={14} /></label>
          </div>
        </div>
        <div className="table-scroll customer-table-scroll"><table className="data-table customer-table"><thead><tr><th>CUSTOMER</th><th>CONTACT</th><th>LOCATION</th><th>ACCESS KEY</th><th>OUTSTANDING</th><th className="align-right">ACTIONS</th></tr></thead><tbody>
          {filteredCustomers.map((customer) => <tr key={customer.id}>
            <td><div className="customer-cell"><span className={`avatar customer-avatar avatar-${customer.id.length % 4}`}>{customer.photo ? <img src={customer.photo} alt={`${customer.name} profile`} /> : customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong className="table-primary">{customer.name}</strong><small className="table-secondary">Customer</small></span></div></td>
            <td><div className="copy-value-cell"><span className="contact-value">{customer.phone}</span><button type="button" className="copy-value-button" aria-label={`Copy ${customer.name}'s contact number`} title="Copy contact number" onClick={() => copyCustomerValue(customer.phone, 'Contact number')}><Copy size={15} /></button></div></td><td><span className="contact-value">{customer.location}</span></td>
            <td><div className="copy-value-cell"><span className="key-badge"><KeyRound size={12} /> {customer.accessKey}</span><button type="button" className="copy-value-button" aria-label={`Copy ${customer.name}'s access key`} title="Copy access key" onClick={() => copyCustomerValue(customer.accessKey, 'Access key')}><Copy size={15} /></button></div></td>
            <td><strong className={`balance-value ${customer.balance <= 0 ? 'balance-clear' : ''}`}>{balanceMoney(customer.balance)}</strong><small className="table-secondary">{customer.balance < 0 ? 'Customer credit' : customer.balance === 0 ? 'All clear' : 'Due balance'}</small></td>
            <td className="align-right"><div className="row-actions"><button title="Record due or payment" aria-label={`Record transaction for ${customer.name}`} className="row-action-button add-payment-button" onClick={() => openTransaction(customer)}><Plus size={15} /></button><div className="row-menu-wrap"><button className="row-action-button" aria-label={`More options for ${customer.name}`} onClick={() => setMenuFor(menuFor === customer.id ? null : customer.id)}><Ellipsis size={17} /></button>{menuFor === customer.id && <div className="row-menu"><button onClick={() => openHistory(customer)}><Clock3 size={14} /> View history</button><button onClick={() => openEdit(customer)}><Edit3 size={14} /> Edit customer</button><button onClick={() => openTransaction(customer)}><BangladeshiTaka size={14} /> Update balance</button><button className="delete-menu-item" onClick={() => { setConfirmDelete(customer); setMenuFor(null) }}><Trash2 size={14} /> Remove customer</button></div>}</div></div></td>
          </tr>)}
        </tbody></table></div>
        {!filteredCustomers.length && <div className="empty-state"><Search size={22} /><strong>No customers found</strong><span>Try a different search or balance filter.</span></div>}
      </section>
      {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><span className=" text-black font-bold text-center md:text-xl">{modal === 'transaction' || modal === 'edit-transaction' ? 'LEDGER UPDATE' : modal === 'create' ? 'NEW ACCOUNT' : 'CUSTOMER PROFILE'}</span><h2 id="modal-title">{modal === 'transaction' ? 'Record due or payment' : modal === 'edit-transaction' ? 'Edit transaction' : modal === 'create' ? 'Add a customer' : 'Edit customer'}</h2></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={() => setModal(null)}><X size={19} /></button></div>
        {modal === 'transaction' || modal === 'edit-transaction' ? <form className="modal-form" onSubmit={modal === 'edit-transaction' ? saveEditedTransaction : saveTransaction}>
          <div className="customer-selected"><span className="avatar customer-avatar avatar-1">{selected?.photo ? <img src={selected.photo} alt={`${selected.name} profile`} /> : selected?.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{selected?.name}</strong><small>Current balance {balanceMoney(selected?.balance || 0)}</small></span></div>
          <label>What would you like to record?<div className="segmented-control"><button type="button" className={transaction.type === 'Payment' ? 'segment-active segment-green' : ''} onClick={() => setTransaction({ ...transaction, type: 'Payment' })}>Payment received</button><button type="button" className={transaction.type === 'Due added' ? 'segment-active segment-red' : ''} onClick={() => setTransaction({ ...transaction, type: 'Due added' })}>New due</button></div></label>
          <label>{transaction.type === 'Payment' ? 'Payment amount (৳)' : 'New due amount (৳)'}<input required type="number" min="1" step="0.01" value={transaction.amount} onChange={(event) => setTransaction({ ...transaction, amount: event.target.value })} placeholder="0.00" /></label>
          <label>Date<input required type="date" value={transaction.date} onChange={(event) => setTransaction({ ...transaction, date: event.target.value })} /></label>
          {transactionBalance !== null && <div className="balance-preview"><span>{transactionBalance < 0 ? 'New customer credit' : 'New outstanding balance'}</span><strong className={transactionBalance < 0 ? 'balance-credit' : ''}>{balanceMoney(transactionBalance)}</strong></div>}
          <div className="modal-actions"><button type="button" className="button button-subtle" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary"><Check size={16} /> {modal === 'edit-transaction' ? 'Save changes' : 'Save transaction'}</button></div>
        </form> : <form className="modal-form" onSubmit={saveCustomer}>
          <div className="customer-photo-field">
            <span className={`avatar customer-avatar customer-photo-preview avatar-${selected ? selected.id.length % 4 : 0}`}>{form.photo ? <img src={form.photo} alt="Customer photo preview" /> : form.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
            <div className="customer-photo-actions"><strong>Customer photo <small>(optional)</small></strong><div><label className="customer-photo-picker"><ImagePlus size={16} /> Choose from gallery<input type="file" accept="image/*" onChange={selectCustomerPhoto} /></label>{form.photo && <button type="button" className="customer-photo-remove" onClick={() => setForm({ ...form, photo: '' })}>Remove photo</button>}</div></div>
          </div>
          <label>Full name<input required autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Customer name" /></label>
          <div className="form-two-col"><label>Phone number<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+880 1XXX-XXXXXX" /></label><label>Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Area, city" /></label></div>
          {modal === 'create' ? <><div className="form-two-col"><label>Starting due (৳)<input type="number" min="0" step="0.01" value={form.balance} onChange={(event) => setForm({ ...form, balance: event.target.value })} placeholder="0" /></label><label>Due date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label></div><div className="key-note"><KeyRound size={16} /><span>A unique 8-digit customer key will be generated. Share it privately with this customer.</span></div></> : <><label>Balance correction (৳)<input required type="number" step="0.01" value={form.balance} onChange={(event) => setForm({ ...form, balance: event.target.value })} /></label><div className="key-note correction-note"><Edit3 size={15} /><span>Use this to correct the balance directly. Enter a negative amount to record customer credit. For a dated payment or new due, use “Update balance” instead.</span></div></>}
          <div className="modal-actions"><button type="button" className="button button-subtle" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary"><Check size={16} /> {modal === 'create' ? 'Create customer' : 'Save changes'}</button></div>
        </form>}
      </section></div>}
      {activeHistoryCustomer && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setHistoryCustomer(null)}><section className="modal-card history-card" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div className="modal-heading"><div><span className="eyebrow">CUSTOMER LEDGER</span><h2 id="history-title">{activeHistoryCustomer.name} history</h2></div><button type="button" className="icon-button" aria-label="Close history" onClick={() => setHistoryCustomer(null)}><X size={19} /></button></div>
        <div className="history-balance"><span>{activeHistoryCustomer.balance < 0 ? 'Customer credit' : 'Current outstanding'}</span><strong className={activeHistoryCustomer.balance < 0 ? 'balance-credit' : ''}>{balanceMoney(activeHistoryCustomer.balance)}</strong></div>
        {activeHistoryCustomer.history?.length ? <div className="customer-history-list">{activeHistoryCustomer.history.slice().sort((a, b) => b.date.localeCompare(a.date)).map((item) => <div className="customer-history-item" key={item.id}><span className={`ledger-icon ${item.type === 'Payment' ? 'ledger-paid' : 'ledger-due'}`}><BangladeshiTaka /></span>
        <span className="ledger-description"><strong>{item.type === 'Payment' ? 'Payment received' : 'Due added'}</strong><small>{new Date(`${item.date}T00:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</small></span>
        
        <strong className={`ledger-amount ${item.type === 'Payment' ? 'ledger-amount-paid' : ''}`}>{item.type === 'Payment' ? '−' : '+'} {money(item.amount)}</strong><button type="button" className="history-edit-button" aria-label={`Edit ${item.type.toLowerCase()} transaction from ${item.date}`} onClick={() => openEditTransaction(activeHistoryCustomer, item)}><Edit3 size={14} /><span>Edit</span></button></div>)}</div> : <div className="empty-state">No transactions recorded yet.</div>}
        <div className="modal-actions"><button type="button" className="button button-subtle" onClick={() => setHistoryCustomer(null)}>Close</button><button type="button" className="button button-primary" onClick={() => { setHistoryCustomer(null); openTransaction(activeHistoryCustomer) }}><Plus size={16} /> Add due or payment</button></div>
      </section></div>}
      {confirmDelete && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setConfirmDelete(null)}><section className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><span className="confirm-icon"><Trash2 size={21} /></span><h2 id="delete-title">Remove customer?</h2><p>This will permanently remove <strong>{confirmDelete.name}</strong> and their transaction history from this browser.</p><div className="modal-actions"><button type="button" className="button button-subtle" onClick={() => setConfirmDelete(null)}>No, keep customer</button><button type="button" className="button button-danger" onClick={removeCustomer}>Yes, remove</button></div></section></div>}
    </>
  )
}

function emptyCustomer() {
  return { name: '', phone: '', location: '', balance: '', date: today(), photo: '' }
}

function optimizeCustomerPhoto(file) {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      try {
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('This image has invalid dimensions.')
        const scale = Math.min(1, 360 / Math.max(image.naturalWidth, image.naturalHeight))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.naturalWidth * scale)
        canvas.height = Math.round(image.naturalHeight * scale)
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Your browser could not process this image.')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } catch {
        reject(new Error('Unable to process this photo. Please choose another image.'))
      } finally {
        URL.revokeObjectURL(imageUrl)
      }
    }
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      reject(new Error('Unable to open this photo. Please choose another image.'))
    }
    image.src = imageUrl
  })
}
