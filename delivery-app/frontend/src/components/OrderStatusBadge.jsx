const STYLES = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  PREPARING: 'bg-stone-200 text-stone-800 border-stone-400',
  IN_DELIVERY: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  DELIVERED: 'bg-emerald-800 text-stone-50 border-emerald-900',
  CANCELLED: 'bg-stone-300 text-stone-700 border-stone-400',
}

const LABELS = {
  PENDING: 'En attente',
  PREPARING: 'En préparation',
  IN_DELIVERY: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        STYLES[status] || STYLES.PENDING
      }`}
    >
      {LABELS[status] || status}
    </span>
  )
}
