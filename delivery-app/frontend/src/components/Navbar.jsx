import { Link, NavLink, useNavigate } from 'react-router-dom'
import { PackageCheck, ShoppingCart, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function linkClass({ isActive }) {
  return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-emerald-800 text-stone-50'
      : 'text-stone-800 hover:bg-stone-200/80'
  }`
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/60 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-amber-400 shadow-soft transition-transform group-hover:scale-105">
            <PackageCheck className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display text-lg leading-tight text-emerald-800">
              Livraison
            </p>
            <p className="text-xs uppercase tracking-wider text-stone-500">Commande</p>
          </div>
        </Link>

        {user && (
          <nav className="flex flex-wrap items-center gap-1">
            {user.role === 'CLIENT' && (
              <>
                <NavLink to="/catalog" className={linkClass}>
                  Catalogue
                </NavLink>
                <NavLink to="/orders" className={linkClass}>
                  Mes commandes
                </NavLink>
                <NavLink
                  to="/catalog"
                  className="relative ml-1 flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-stone-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Panier
                  {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-800 px-1 text-xs text-stone-50">
                      {count}
                    </span>
                  )}
                </NavLink>
              </>
            )}
            {user.role === 'ADMIN_DISPATCH' && (
              <NavLink to="/admin" className={linkClass}>
                Dashboard Admin
              </NavLink>
            )}
            {user.role === 'LIVREUR' && (
              <NavLink to="/delivery" className={linkClass}>
                Dashboard Livreur
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-stone-900">{user.username}</p>
                <p className="text-xs text-stone-500">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 hover:bg-stone-200"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Connexion
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-medium text-stone-50"
              >
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
