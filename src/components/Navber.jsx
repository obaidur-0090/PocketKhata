import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'
import PocketKhata from "../assets/PocketKhata.png"
export default function Navber() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="landing-nav">
      <Link to="/" className="brand-lockup" onClick={closeMenu}>
        <img className="md:w-[70px] w-[50px]" src={PocketKhata} alt="" />
        <span className='text-2xl'>Pocket<span className="brand-accent">KhaTa</span></span>
      </Link>

      <nav className="landing-nav-links" aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
      </nav>

      <div className="landing-nav-actions">
        <Link to="/customer/login" className="nav-customer">Customer login</Link>
        <Link to="/admin/login" className="button button-primary landing-login">Admin login</Link>
      </div>

      <div className="landing-mobile-menu">
        <button
          type="button"
          className="button button-primary landing-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? 'Close' : 'Menu'}
          {menuOpen ? <X size={17} /> : <Menu size={17} />}
        </button>

        {menuOpen && (
          <div
            id="mobile-navigation"
            className="landing-mobile-dropdown"
          >
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <div className="landing-mobile-divider" />
            <Link to="/customer/login" onClick={closeMenu}>Customer login</Link>
            <Link to="/admin/login" onClick={closeMenu}>Admin login</Link>
          </div>
        )}
      </div>
    </header>
  )
}
