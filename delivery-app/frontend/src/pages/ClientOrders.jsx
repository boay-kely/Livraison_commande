import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { orderApi } from '../services/api'

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function ClientOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await orderApi.list()
      setOrders(res.data)
      setError('')
    } catch {
      setError('Impossible de charger vos commandes.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const id = setInterval(() => fetchOrders(true), 5000)
    return () => clearInterval(id)
  }, [fetchOrders])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-emerald-800">Mes commandes</h1>
          <p className="text-sm text-stone-600">Statut actualisé toutes les 5 secondes</p>
        </div>
        <button
          type="button"
          onClick={() => fetchOrders()}
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
      ) : !orders.length ? (
        <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-500">
          Aucune commande pour le moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-lg border border-stone-200 bg-stone-50 p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-900">Commande #{order.id}</p>
                  <p className="text-xs text-stone-500">
                    {new Date(order.date_creation).toLocaleString('fr-FR')}
                  </p>
                </div>
                <OrderStatusBadge status={order.statut} />
              </div>
              <p className="mt-3 text-sm text-stone-700">{order.adresse_texte}</p>
              <p className="text-sm text-stone-500">{order.telephone}</p>
              <ul className="mt-3 space-y-1 border-t border-stone-200 pt-3 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-stone-700">
                    <span>
                      {item.quantity}× {item.product_name}
                    </span>
                    <span>{formatPrice(item.line_total)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-right font-semibold text-emerald-800">
                Total : {formatPrice(order.montant_total)}
              </p>
              {order.livreur_username && (
                <p className="mt-1 text-right text-xs text-stone-500">
                  Livreur : {order.livreur_username}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
