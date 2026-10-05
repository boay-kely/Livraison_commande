import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function homeForRole(role) {
  if (role === 'ADMIN_DISPATCH') return '/admin'
  if (role === 'LIVREUR') return '/delivery'
  return '/catalog'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form.username.trim(), form.password)
      navigate(homeForRole(user.role))
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(
        typeof detail === 'string'
          ? detail
          : 'Identifiants incorrects. Réessayez.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-lg border border-stone-200 bg-stone-50 p-6 shadow-soft"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-800 text-amber-400">
            <LogIn className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-stone-900">Connexion</h1>
            <p className="text-sm text-stone-600">Accédez à votre espace livraison</p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {error}
          </p>
        )}

        <label className="mb-3 block text-sm font-medium text-stone-800">
          Nom d&apos;utilisateur
          <input
            className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            autoComplete="username"
          />
        </label>

        <label className="mb-5 block text-sm font-medium text-stone-800">
          Mot de passe
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-800 py-2.5 font-medium text-stone-50 hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="mt-4 text-center text-sm text-stone-600">
          Pas de compte ?{' '}
          <Link to="/register" className="font-semibold text-amber-700 hover:underline">
            S&apos;inscrire
          </Link>
        </p>

        <p className="mt-4 rounded-lg bg-stone-200/60 p-3 text-xs text-stone-600">
          Comptes démo : admin/admin123 · livreur1/livreur123 · client1/client123
        </p>
      </form>
    </div>
  )
}
