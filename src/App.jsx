import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './auth/AuthContext'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import CustomerLogin from './pages/CustomerLogin'
import CustomerPortal from './pages/CustomerPortal'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProfileSettings from './pages/ProfileSettings'
import Transactions from './pages/Transactions'
import User from './pages/User'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<User />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute role="customer" />}>
            <Route path="/customer" element={<CustomerPortal />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3600} hideProgressBar theme="light" />
    </AuthProvider>
  )
}
