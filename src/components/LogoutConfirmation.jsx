import { LogOut } from 'lucide-react'

export default function LogoutConfirmation({ onCancel, onConfirm, busy = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !busy && onCancel()}>
      <section className="confirm-card logout-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="logout-title">
        <span className="confirm-icon"><LogOut size={21} /></span>
        <h2 id="logout-title">Sign out?</h2>
        <p>Are you sure you want to sign out of your account?</p>
        <div className="modal-actions">
          <button type="button" className="button button-subtle" disabled={busy} onClick={onCancel}>Stay signed in</button>
          <button type="button" className="button button-primary" disabled={busy} onClick={onConfirm}>{busy ? 'Signing out…' : 'Yes, sign out'}</button>
        </div>
      </section>
    </div>
  )
}
