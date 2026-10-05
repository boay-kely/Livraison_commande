import { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { orderApi, productApi } from '../services/api'

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adresse, setAdresse] = useState('')
  const [telephone, setTelephone] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [success, setSuccess] = useState('')
  const { items, addItem, updateQuantity, removeItem, clearCart, total } = useCart()

  useEffect(() => {
    productApi
      .list()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false))
  }, [])

  const placeOrder = async (e) => {
    e.preventDefault()
    if (!items.length) return
    setOrdering(true)
    setError('')
    setSuccess('')
    try {
      await orderApi.create({
        adresse_texte: adresse,
        telephone,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      })
      clearCart()
      setAdresse('')
      setTelephone('')
      setSuccess('Commande passée avec succès.')
      const refreshed = await productApi.list()
      setProducts(refreshed.data)
    } catch (err) {
      const msg =
        err.response?.data?.items ||
        err.response?.data?.detail ||
        'Échec de la commande.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setOrdering(false)
    }
  }

  if (loading) {
    return <p className="px-4 py-10 text-center text-stone-600">Chargement du catalogue…</p>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-emerald-800">Catalogue</h1>
        <p className="mt-1 text-stone-600">Ajoutez des produits au panier local, puis commandez.</p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {success}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addItem} />
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-stone-200 bg-stone-50 p-4 shadow-soft lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            <h2 className="font-display text-xl text-stone-900">Panier</h2>
          </div>

          {!items.length ? (
            <p className="text-sm text-stone-500">Votre panier est vide.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="rounded-lg border border-stone-200 bg-stone-100/80 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-stone-900">{product.name}</p>
                      <p className="text-xs text-stone-500">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-stone-500 hover:text-amber-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-stone-300 p-1"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      type="button"
                      className="rounded-lg border border-stone-300 p-1"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mb-4 text-right text-lg font-semibold text-emerald-800">
            Total : {formatPrice(total)}
          </p>

          <form onSubmit={placeOrder} className="space-y-3">
            <label className="block text-sm font-medium text-stone-800">
              Adresse de livraison
              <textarea
                className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 text-sm outline-none focus:border-emerald-700"
                rows={2}
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-800">
              Téléphone
              <input
                className="mt-1 w-full rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 text-sm outline-none focus:border-emerald-700"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              disabled={!items.length || ordering}
              className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-stone-50 disabled:opacity-40"
            >
              {ordering ? 'Envoi…' : 'Passer la commande'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
