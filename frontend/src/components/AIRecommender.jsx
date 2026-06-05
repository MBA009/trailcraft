import React, { useState } from 'react'
import axios from 'axios'
import ProductDetail from './ProductDetail'

const API = () => import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AIRecommender({ onClose }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const ask = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await axios.post(`${API()}/api/recommend`, { query })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') ask() }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">AI Shoe Finder</p>
                <p className="text-xs text-gray-400">Describe what you're looking for</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Suggestions */}
            {!result && !loading && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Try asking</p>
                {[
                  'Running shoes for wide feet under $120',
                  'Comfortable everyday women\'s shoes',
                  'Trail shoes with good traction for hiking',
                ].map(s => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="w-full text-left text-sm text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-lg transition-all border border-gray-100 hover:border-orange-200">
                    "{s}"
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Finding the best matches...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm text-gray-700">
                  {result.message}
                </div>
                {result.recommendations.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No matching products found. Try a different description.</p>
                )}
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden hover:border-orange-200 transition-all">
                    <div className="flex gap-3 p-3">
                      <img
                        src={rec.product.image || 'https://via.placeholder.com/80x80?text=Shoe'}
                        alt={rec.product.name}
                        className="w-20 h-20 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{rec.product.name}</p>
                        <p className="text-xs text-gray-400">{rec.product.brand}</p>
                        <p className="text-sm font-bold text-orange-500 mt-1">${rec.product.price}</p>
                        <p className="text-xs text-gray-500 mt-1 italic">"{rec.reason}"</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-50 px-3 py-2">
                      <button
                        onClick={() => setSelectedProduct(rec.product)}
                        className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-1.5 rounded-lg transition-all"
                      >
                        View & Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setResult(null); setQuery('') }}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1">
                  ← Ask something else
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          {!result && (
            <div className="border-t border-gray-100 px-4 py-3 flex gap-2 bg-gray-50">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="e.g. lightweight running shoes size 10..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white"
                disabled={loading}
              />
              <button
                onClick={ask}
                disabled={loading || !query.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  )
}
