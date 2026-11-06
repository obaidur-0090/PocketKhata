const STORAGE_KEY = 'pocketkhata-data-v1'
const DEFAULT_SHOP_NAME = 'PocketKhata Shop'

const initialCustomers = [
  { id: 'pk-1001', name: 'Ayesha Rahman', phone: '+880 1712-345678', location: 'Dhanmondi, Dhaka', balance: 12500, accessKey: '24816357', history: [{ id: 't-1', type: 'Due added', amount: 15000, date: '2026-10-12' }, { id: 't-2', type: 'Payment', amount: 2500, date: '2026-10-18' }] },
  { id: 'pk-1002', name: 'Tanvir Hasan', phone: '+880 1811-203040', location: 'Uttara, Dhaka', balance: 8200, accessKey: '83617524', history: [{ id: 't-3', type: 'Due added', amount: 8200, date: '2026-10-20' }] },
  { id: 'pk-1003', name: 'Nusrat Jahan', phone: '+880 1915-667788', location: 'Agrabad, Chattogram', balance: 0, accessKey: '71529463', history: [{ id: 't-4', type: 'Due added', amount: 6000, date: '2026-10-02' }, { id: 't-5', type: 'Payment', amount: 6000, date: '2026-10-23' }] },
  { id: 'pk-1004', name: 'Fahim Chowdhury', phone: '+880 1610-321456', location: 'Sylhet Sadar, Sylhet', balance: 21400, accessKey: '39264817', history: [{ id: 't-6', type: 'Due added', amount: 24000, date: '2026-09-28' }, { id: 't-7', type: 'Payment', amount: 2600, date: '2026-10-21' }] },
  { id: 'pk-1005', name: 'Maliha Karim', phone: '+880 1755-909090', location: 'Mirpur, Dhaka', balance: 5600, accessKey: '58274196', history: [{ id: 't-8', type: 'Due added', amount: 7600, date: '2026-10-14' }, { id: 't-9', type: 'Payment', amount: 2000, date: '2026-10-25' }] },
  { id: 'pk-1006', name: 'Rafiq Islam', phone: '+880 1888-102938', location: 'Rajshahi Sadar, Rajshahi', balance: 0, accessKey: '16483927', history: [{ id: 't-10', type: 'Due added', amount: 4500, date: '2026-10-08' }, { id: 't-11', type: 'Payment', amount: 4500, date: '2026-10-24' }] },
]

function readData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.customers)) {
        const customers = parsed.customers.map((customer) => {
          const migratedCustomer = { ...customer }
          delete migratedCustomer.email
          return migratedCustomer
        })
        const migratedData = {
          ...parsed,
          customers,
          shopName: typeof parsed.shopName === 'string' && parsed.shopName.trim()
            ? parsed.shopName.trim()
            : DEFAULT_SHOP_NAME,
        }
        if (parsed.customers.some((customer) => customer && Object.hasOwn(customer, 'email'))) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData))
          } catch (error) {
            console.error('Unable to remove legacy customer emails from local storage.', error)
          }
        }
        return migratedData
      }
    }
  } catch (error) {
    console.error('Unable to read PocketKhata data from local storage.', error)
  }
  return { customers: initialCustomers, shopName: DEFAULT_SHOP_NAME }
}

let data = readData()
const listeners = new Set()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Unable to save PocketKhata data to local storage.', error)
    throw new Error('Your browser could not save the latest changes. Check available storage and try again.', { cause: error })
  }
  listeners.forEach((listener) => listener(data.customers))
}

export function getCustomers() {
  return data.customers
}

export function subscribeCustomers(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getShopName() {
  return data.shopName
}

export function subscribeShopName(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function updateShopName(name) {
  const shopName = name.trim()
  if (!shopName) throw new Error('Enter a shop name.')
  if (shopName.length > 80) throw new Error('Shop name must be 80 characters or fewer.')
  data = { ...data, shopName }
  persist()
}

export function createCustomer(input) {
  const customerInput = { ...input }
  delete customerInput.email
  const customer = {
    ...customerInput,
    id: `pk-${Date.now()}`,
    balance: Number(input.balance) || 0,
    accessKey: createAccessKey(),
    history: Number(input.balance) > 0
      ? [{ id: `t-${Date.now()}`, type: 'Due added', amount: Number(input.balance), date: input.date }]
      : [],
  }
  data.customers = [customer, ...data.customers]
  persist()
  return customer
}

export function updateCustomer(id, updates) {
  data.customers = data.customers.map((customer) => (
    customer.id === id
      ? { ...customer, ...updates, balance: Number(updates.balance ?? customer.balance) }
      : customer
  ))
  persist()
}

export function deleteCustomer(id) {
  data.customers = data.customers.filter((customer) => customer.id !== id)
  persist()
}

export function addTransaction(id, { type, amount, date }) {
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) throw new Error('Transaction amount must be greater than zero.')
  if (!['Payment', 'Due added'].includes(type)) throw new Error('Choose a valid transaction type.')
  if (!date || Number.isNaN(Date.parse(`${date}T00:00:00`))) throw new Error('Choose a valid transaction date.')
  const customer = data.customers.find((entry) => entry.id === id)
  if (!customer) throw new Error('Customer not found.')

  data.customers = data.customers.map((customer) => {
    if (customer.id !== id) return customer
    const balance = type === 'Payment' ? customer.balance - value : customer.balance + value
    return {
      ...customer,
      balance,
      history: [{ id: `t-${Date.now()}`, type, amount: value, date }, ...(customer.history || [])],
    }
  })
  persist()
}

export function updateTransaction(customerId, transactionId, { type, amount, date }) {
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) throw new Error('Transaction amount must be greater than zero.')
  if (!['Payment', 'Due added'].includes(type)) throw new Error('Choose a valid transaction type.')
  if (!date || Number.isNaN(Date.parse(`${date}T00:00:00`))) throw new Error('Choose a valid transaction date.')

  const customer = data.customers.find((entry) => entry.id === customerId)
  if (!customer) throw new Error('Customer not found.')
  const transaction = customer.history?.find((item) => item.id === transactionId)
  if (!transaction) throw new Error('Transaction not found.')

  const previousImpact = transaction.type === 'Payment' ? -transaction.amount : transaction.amount
  const nextImpact = type === 'Payment' ? -value : value
  const balance = customer.balance + nextImpact - previousImpact
  const precision = Number.EPSILON * Math.max(1, Math.abs(customer.balance), value, transaction.amount)

  data.customers = data.customers.map((entry) => entry.id !== customerId ? entry : {
    ...entry,
    balance: Math.abs(balance) <= precision ? 0 : balance,
    history: entry.history.map((item) => item.id === transactionId ? { ...item, type, amount: value, date } : item),
  })
  persist()
}

export function findCustomerByKey(key) {
  return data.customers.find((customer) => customer.accessKey === key)
}

function createAccessKey() {
  const existing = new Set(data.customers.map((customer) => customer.accessKey))
  let key
  do {
    const values = new Uint32Array(1)
    crypto.getRandomValues(values)
    key = String(10000000 + (values[0] % 90000000))
  } while (existing.has(key))
  return key
}
