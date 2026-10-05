import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'
import AdminDashboard from './pages/AdminDashboard'
import Catalog from './pages/Catalog'
import ClientOrders from './pages/ClientOrders'
import DeliveryDashboard from './pages/DeliveryDashboard'
import Login from './pages/Login'
import Register from './pages/Register'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <p className="px-4 py-16 text-center text-stone-600">Chargement de la session…</p>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'ADMIN_DISPATCH') return <Navigate to="/admin" replace />
    if (user.role === 'LIVREUR') return <Navigate to="/delivery" replace />
    return <Navigate to="/catalog" replace />
  }
  return children
}

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <p className="px-4 py-16 text-center text-stone-600">Chargement…</p>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN_DISPATCH') return <Navigate to="/admin" replace />
  if (user.role === 'LIVREUR') return <Navigate to="/delivery" replace />
  return <Navigate to="/catalog" replace />
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <Catalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <ClientOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN_DISPATCH']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute roles={['LIVREUR']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
