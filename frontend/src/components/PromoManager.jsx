import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API = () => import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function PromoManager({ onClose }) {
  const { api } = useAuth()
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const fetch = async () => {
    try {
      const res = await api.get(`${API()}/api/promos`)
      setPromos(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const create = async () => {
    if (!code.trim() || !discount) return
    const d = Number(discount)
    if (d < 1 || d > 100) { setError('Discount must be between 1 and 100'); return }
    setCreating(true)
    setError('')
    try {
      await api.post(`${API()}/api/promos`, { code: code.trim(), discount: d })
      setCode('')
      setDiscount('')
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create promo')
    } finally {
      setCreating(false)
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`${API()}/api/promos/${id}`)
      setPromos(prev => prev.filter(p => p._id !== id))
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-900">Promo Codes</p>
            <p className="text-xs text-gray-400">Create and manage discount codes</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Create form */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">New Promo Code</p>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="Code e.g. SAVE20"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white uppercase font-mono tracking-wider"
                onKeyDown={e => e.key === 'Enter' && create()}
              />
              <div className="relative w-24">
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  placeholder="% off"
                  min="1"
                  max="100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white pr-7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={create}
              disabled={creating || !code.trim() || !discount}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2 rounded-lg transition-all disabled:opacity-40"
            >
              {creating ? 'Creating...' : 'Create Code'}
            </button>
          </div>

          {/* Promo list */}
          {loading && <p className="text-sm text-gray-400 text-center py-4">Loading...</p>}
          {!loading && promos.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No promo codes yet.</p>
          )}
          {promos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Codes</p>
              {promos.map(p => (
                <div key={p._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-gray-900 tracking-wider text-sm">{p.code}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {p.discount}% off
                    </span>
                    {!p.active && (
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                  <button
                    onClick={() => remove(p._id)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
