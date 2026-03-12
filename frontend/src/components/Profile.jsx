import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  pending:          { label: 'Pending',           color: 'bg-yellow-100 text-yellow-700' },
  processing:       { label: 'Processing',        color: 'bg-blue-100 text-blue-700' },
  in_transit:       { label: 'In Transit',        color: 'bg-indigo-100 text-indigo-700' },
  out_for_delivery: { label: 'Out for Delivery',  color: 'bg-purple-100 text-purple-700' },
  delivered:        { label: 'Delivered',         color: 'bg-green-100 text-green-700' },
  cancelled:        { label: 'Cancelled',         color: 'bg-red-100 text-red-700' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

export default function Profile({ onClose }) {
  const { user, api } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (!user) return
    api.get(`${url}/api/orders`)
      .then(r => setOrders(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  const initials = (user.name || user.email || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />

        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.name || 'Your Account'}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">{user.role}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Orders</h4>

          {loading && <p className="text-sm text-gray-400">Loading…</p>}

          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-24 gap-2 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <p className="text-sm">No orders yet</p>
            </div>
          )}

          <div className="space-y-3">
            {orders.map(o => (
              <div key={o._id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-gray-400">#{o._id?.slice(-8)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={o.status || 'pending'} />
                    <span className="font-bold text-gray-900">${o.total?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {o.items?.map((it, idx) => (
                    <span key={idx} className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 text-gray-600">
                      {it.qty}× {it.name}{it.size ? ` (Sz ${it.size})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
