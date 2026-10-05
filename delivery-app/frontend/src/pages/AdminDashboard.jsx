import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, UserCheck } from 'lucide-react'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { livreurApi, orderApi } from '../services/api'

const STATUSES = [
  'PENDING',
  'PREPARING',
  'IN_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [livreurs, setLivreurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [ordersRes, livreursRes] = await Promise.all([
        orderApi.list(),
        livreurApi.list(),
      ])
      setOrders(ordersRes.data)
      setLivreurs(livreursRes.data)
      setError('')
    } catch {
      setError('Impossible de charger le dashboard admin.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(() => load(true), 5000)
    return () => clearInterval(id)
  }, [load])

  const updateOrder = async (orderId, payload) => {
    setBusyId(orderId)
    try {
      await orderApi.updateStatus(orderId, payload)
      await load(true)
    } catch {
      setError('Mise à jour impossible.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-emerald-800">Dashboard Admin</h1>
          <p className="text-sm text-stone-600">
            Assignation livreur &amp; suivi des statuts (polling 5s)
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm hover:bg-stone-200"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-stone-600">Chargement…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-stone-50 shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-200/50 text-stone-700">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Livreur</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-stone-100 align-top">
                  <td className="px-4 py-3 font-semibold">{order.id}</td>
                  <td className="px-4 py-3">
                    <p>{order.client_username}</p>
                    <p className="text-xs text-stone-500">{order.telephone}</p>
                    <p className="max-w-xs text-xs text-stone-500">{order.adresse_texte}</p>
                  </td>
                  <td className="px-4 py-3 text-emerald-800 font-medium">
                    {formatPrice(order.montant_total)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.statut} />
                    <select
                      className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-100 px-2 py-1.5 text-xs"
                      value={order.statut}
                      disabled={busyId === order.id}
                      onChange={(e) =>
                        updateOrder(order.id, { statut: e.target.value })
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="w-full rounded-lg border border-stone-300 bg-stone-100 px-2 py-1.5 text-xs"
                      value={order.livreur || ''}
                      disabled={busyId === order.id}
                      onChange={(e) =>
                        updateOrder(order.id, {
                          livreur_id: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    >
                      <option value="">Non assigné</option>
                      {livreurs.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.username}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === order.id || !livreurs.length}
                      onClick={() =>
                        updateOrder(order.id, {
                          livreur_id: livreurs[0].id,
                          statut: 'PREPARING',
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-800 px-2.5 py-1.5 text-xs font-medium text-stone-50 disabled:opacity-40"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Assigner 1er
                    </button>
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    Aucune commande.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
