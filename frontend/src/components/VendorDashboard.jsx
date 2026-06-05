import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API = () => import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function VendorDashboard({ onClose }) {
  const { api } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`${API()}/api/orders/vendor`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-900">Sales Dashboard</p>
            <p className="text-xs text-gray-400">Your store performance</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-sm text-red-500 text-center py-8">{error}</p>}

          {data && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-xs text-orange-400 font-medium uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${data.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalOrders}</p>
                </div>
              </div>

              {/* Orders */}
              {data.orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <p className="text-sm text-gray-400">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Orders</p>
                  {data.orders.map(order => (
                    <div key={order._id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8)}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.vendorItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.qty}</span></span>
                            <span className="font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm font-bold text-orange-500">+${order.vendorRevenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
