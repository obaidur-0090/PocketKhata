import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { ArrowLeftRight, Download, LayoutDashboard, LogOut, Menu, Settings, UsersRound } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/useAuth'
import { getCustomers } from '../data/store'
import LogoutConfirmation from './LogoutConfirmation'
import PocketKhata from '../assets/PocketKhata.png'
const navigation = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Customers', icon: UsersRound },
  { to: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/admin/profile', label: 'Profile settings', icon: Settings },
]

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPage = location.pathname.endsWith('/users')
    ? 'Customers'
    : location.pathname.endsWith('/transactions')
      ? 'Transactions'
      : location.pathname.endsWith('/profile')
        ? 'Profile settings'
        : 'Overview'

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/admin/login')
    } catch (error) {
      toast.error(error.message || 'Unable to sign out. Please try again.')
    } finally {
      setLoggingOut(false)
      setLogoutOpen(false)
    }
  }

  function downloadUserData() {
    if (session?.role !== 'admin') {
      toast.error('Only admins can download user data.')
      return
    }

    try {
      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        customers: getCustomers(),
      }
      const file = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = 'userData.json'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
      toast.success('User data backup downloaded.')
    } catch (error) {
      console.error('Unable to download the user data backup.', error)
      toast.error('Unable to download the user data backup.')
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <NavLink to="/admin" className="brand-lockup" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><img src={PocketKhata} alt="" /></span>
          <span className='text-2xl'>Pocket<span className="brand-accent">KhaTa</span></span>
        </NavLink>
        
        <nav className="side-nav">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={20} strokeWidth={1.8} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom hidden md:block">
          <div className="help-card">
            <h1 className="text-red-500">This apps make my "Obaidur Rahman"</h1>
          </div>
          <button type="button" className="profile-button" onClick={() => setLogoutOpen(true)}>
            <span className="avatar avatar-red">{(session?.name || 'A').slice(0, 1).toUpperCase()}</span>
            <span className="profile-copy"><strong>{session?.name || 'Admin account'}</strong><small>Administrator</small></span>
            <LogOut size={17} className="profile-logout" />
          </button>
        </div>
      </aside>
      {menuOpen && <button className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen((open) => !open)}><Menu size={20} /></button>
          <div><strong>{currentPage}</strong></div>
          <div className="topbar-actions">
            <span className="today-label">{new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            {session?.role === 'admin' && <button type="button" className="button button-subtle backup-button" onClick={downloadUserData} title="Download userData.json"><Download size={15} /><span>Backup data</span></button>}
            
          </div>
        </header>
        <div className="content-area"><Outlet /></div>
      </main>
      {logoutOpen && <LogoutConfirmation onCancel={() => setLogoutOpen(false)} onConfirm={handleLogout} busy={loggingOut} />}
    </div>
  )
}
