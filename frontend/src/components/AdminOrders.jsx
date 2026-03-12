import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = [
  { value: 'pending',          label: 'Pending',           color: 'bg-yellow-100 text-yellow-700' },
  { value: 'processing',       label: 'Processing',        color: 'bg-blue-100 text-blue-700' },
  { value: 'in_transit',       label: 'In Transit',        color: 'bg-indigo-100 text-indigo-700' },
  { value: 'out_for_delivery', label: 'Out for Delivery',  color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered',        label: 'Delivered',         color: 'bg-green-100 text-green-700' },
  { value: 'cancelled',        label: 'Cancelled',         color: 'bg-red-100 text-red-700' },
]

function StatusBadge({ status }) {
  const opt = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${opt.color}`}>
      {opt.label}
    </span>
  )
}

export default function AdminOrders({ onClose }) {
  const { api } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})

  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    api.get(`${url}/api/orders`)
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }))
    try {
      const res = await api.patch(`${url}/api/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: res.data.status } : o))
    } catch {
      alert('Failed to update status')
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-900" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-display font-bold text-gray-900">Order Management</h3>
            <p className="text-xs text-gray-400 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading orders…</div>
          )}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p className="text-sm">No orders yet</p>
            </div>
          )}
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o._id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">#{o._id?.slice(-8)}</span>
                      <StatusBadge status={o.status || 'pending'} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{o.shipping?.name}</p>
                    <p className="text-xs text-gray-400">{o.shipping?.email}</p>
                    <p className="text-xs text-gray-400">{o.shipping?.address}, {o.shipping?.city}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${o.total?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <select
                      value={o.status || 'pending'}
                      disabled={updating[o._id]}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-400 bg-white disabled:opacity-50 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {o.items?.map((it, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-xs text-gray-600">
                        <span className="font-semibold">{it.qty}×</span> {it.name}
                        {it.size && <span className="text-gray-400">· Sz {it.size}</span>}
                        <span className="text-gray-400">${it.price}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
