import { useState, useSyncExternalStore } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import PageTitle from '../components/PageTitle'
import { getShopName, subscribeShopName, updateShopName } from '../data/store'

const subscribe = (notify) => subscribeShopName(notify)
const getSnapshot = () => getShopName()

export default function ProfileSettings() {
  const shopName = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [name, setName] = useState(shopName)
  const { session } = useAuth()

  function handleSubmit(event) {
    event.preventDefault()
    if (session?.role !== 'admin') {
      toast.error('Only admins can update the shop name.')
      return
    }

    try {
      updateShopName(name)
      setName(name.trim())
      toast.success('Shop name updated.')
    } catch (error) {
      toast.error(error.message || 'Unable to update the shop name.')
    }
  }

  return (
    <>
      <PageTitle title="Profile settings" />
      <div className="page-heading">
        <div>
          <h1>Profile settings<span className="heading-period">.</span></h1>
        </div>
      </div>
      <section className="panel profile-settings-card">
        <div className="profile-settings-heading">
          
          <div>
            <h2 className="md:text-xl font-bold">Shop information</h2>
            <p>Update the shop name shown to your customers.</p>
          </div>
        </div>
        <form className="profile-settings-form" onSubmit={handleSubmit}>
          <label htmlFor="shop-name">Dokan Name</label>
          <input
            id="shop-name"
            name="shopName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            autoComplete="organization"
            required
          />
          <small>Use up to 80 characters. Customers will see this name on their account page.</small>
          <button type="submit" className="button button-primary"> Save shop name</button>
        </form>
      </section>
    </>
  )
}
