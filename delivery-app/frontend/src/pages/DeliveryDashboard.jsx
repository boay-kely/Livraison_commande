import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Package, Truck } from 'lucide-react'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { orderApi } from '../services/api'

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

const NEXT_ACTIONS = {
  PREPARING: { statut: 'IN_DELIVERY', label: 'Partir en livraison', icon: Truck },
  IN_DELIVERY: { statut: 'DELIVERED', label: 'Marquer livrée', icon: CheckCircle2 },
  PENDING: { statut: 'PREPARING', label: 'Prendre en charge', icon: Package },
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await orderApi.list()
      setOrders(res.data)
      setError('')
    } catch {
      setError('Impossible de charger vos livraisons.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(() => load(true), 5000)
    return () => clearInterval(id)
  }, [load])

  const updateStatus = async (orderId, statut) => {
    setBusyId(orderId)
    try {
      await orderApi.updateStatus(orderId, { statut })
      await load(true)
    } catch {
      setError('Mise à jour du statut impossible.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-emerald-800">Dashboard Livreur</h1>
        <p className="text-sm text-stone-600">
          Mettez à jour rapidement le statut de vos courses (polling 5s)
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-stone-600">Chargement…</p>
      ) : !orders.length ? (
        <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-500">
          Aucune livraison assignée pour le moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const action = NEXT_ACTIONS[order.statut]
            const Icon = action?.icon
            return (
              <li
                key={order.id}
                className="rounded-lg border border-stone-200 bg-stone-50 p-4 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">Commande #{order.id}</p>
                    <p className="text-sm text-stone-600">Client : {order.client_username}</p>
                    <p className="mt-1 text-sm text-stone-700">{order.adresse_texte}</p>
                    <p className="text-sm text-amber-700 font-medium">{order.telephone}</p>
                  </div>
                  <OrderStatusBadge status={order.statut} />
                </div>

                <ul className="mt-3 space-y-1 border-t border-stone-200 pt-3 text-sm text-stone-700">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}× {item.product_name}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-emerald-800">
                    {formatPrice(order.montant_total)}
                  </p>
                  {action ? (
                    <button
                      type="button"
                      disabled={busyId === order.id}
                      onClick={() => updateStatus(order.id, action.statut)}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-50 disabled:opacity-50"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {action.label}
                    </button>
                  ) : (
                    <span className="text-sm text-stone-500">Terminée</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
