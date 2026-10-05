import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'CLIENT',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await register(form)
      navigate(user.role === 'LIVREUR' ? '/delivery' : '/catalog')
    } catch (err) {
      const data = err.response?.data
      const msg =
        data?.username?.[0] ||
        data?.password?.[0] ||
        data?.detail ||
        "Impossible de créer le compte."
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-lg border border-stone-200 bg-stone-50 p-6 shadow-soft"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-800 text-amber-400">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-stone-900">Inscription</h1>
            <p className="text-sm text-stone-600">Créez un compte client ou livreur</p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {error}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-stone-800">
            Prénom
            <input
              name="first_name"
              className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
              value={form.first_name}
              onChange={onChange}
            />
          </label>
          <label className="block text-sm font-medium text-stone-800">
            Nom
            <input
              name="last_name"
              className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
              value={form.last_name}
              onChange={onChange}
            />
          </label>
        </div>

        <label className="mt-3 block text-sm font-medium text-stone-800">
          Nom d&apos;utilisateur
          <input
            name="username"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
            value={form.username}
            onChange={onChange}
            required
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-stone-800">
          Email
          <input
            type="email"
            name="email"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
            value={form.email}
            onChange={onChange}
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-stone-800">
          Mot de passe
          <input
            type="password"
            name="password"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-stone-800">
          Rôle
          <select
            name="role"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 outline-none focus:border-emerald-700"
            value={form.role}
            onChange={onChange}
          >
            <option value="CLIENT">Client</option>
            <option value="LIVREUR">Livreur</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-lg bg-emerald-800 py-2.5 font-medium text-stone-50 hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? 'Création…' : 'Créer mon compte'}
        </button>

        <p className="mt-4 text-center text-sm text-stone-600">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-amber-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  )
}
