import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth'

export default function ProtectedRoute({ role }) {
  const { session } = useAuth()
  if (!session) return <Navigate to={role === 'customer' ? '/customer/login' : '/admin/login'} replace />
  if (role === 'customer' && session.role !== 'customer') return <Navigate to="/customer/login" replace />
  if (role === 'admin' && session.role !== 'admin') return <Navigate to="/admin/login" replace />
  return <Outlet />
}
