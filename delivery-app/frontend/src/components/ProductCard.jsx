import { Plus } from 'lucide-react'

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function ProductCard({ product, onAdd }) {
  const outOfStock = product.stock <= 0

  return (
    <article className="flex flex-col rounded-lg border border-stone-200/80 bg-stone-50 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-800/15 to-amber-600/15">
        <span className="font-display text-3xl text-emerald-800/40">
          {product.name.charAt(0)}
        </span>
      </div>
      <h3 className="font-display text-lg text-stone-900">{product.name}</h3>
      <p className="mt-1 flex-1 text-sm text-stone-600 line-clamp-2">
        {product.description}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-emerald-800">{formatPrice(product.price)}</p>
          <p className="text-xs text-stone-500">Stock : {product.stock}</p>
        </div>
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAdd(product)}
          className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>
    </article>
  )
}
