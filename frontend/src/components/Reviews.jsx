import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = () => import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Stars({ rating, interactive = false, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`text-lg transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            n <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'
          }`}
        >★</button>
      ))}
    </div>
  )
}

export default function Reviews({ productId }) {
  const { user, api } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API()}/api/reviews/${productId}`)
      setReviews(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [productId])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const submit = async () => {
    if (!rating) return
    setSubmitting(true)
    setError('')
    try {
      await api.post(`${API()}/api/reviews`, { productId, rating, comment })
      setComment('')
      setRating(5)
      setShowForm(false)
      fetchReviews()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteReview = async (id) => {
    try {
      await api.delete(`${API()}/api/reviews/${id}`)
      setReviews(prev => prev.filter(r => r._id !== id))
    } catch {}
  }

  const alreadyReviewed = user && reviews.some(r => r.customerId === user.id)

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-gray-900">Reviews</p>
          {avgRating && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="text-yellow-400">★</span>
              {avgRating} ({reviews.length})
            </span>
          )}
        </div>
        {user?.role === 'customer' && !alreadyReviewed && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 px-3 py-1 rounded-lg transition-all">
            + Write a review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Your rating</p>
            <Stars rating={rating} interactive onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your thoughts (optional)..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none bg-white"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button onClick={submit} disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="text-sm text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading && <p className="text-xs text-gray-400 py-2">Loading reviews...</p>}
      {!loading && reviews.length === 0 && (
        <p className="text-xs text-gray-400 py-2">No reviews yet. Be the first!</p>
      )}
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r._id} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-500 flex-shrink-0 uppercase">
              {(r.customerName || 'U')[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-700">{r.customerName?.split('@')[0]}</p>
                  <Stars rating={r.rating} />
                </div>
                {(user?.role === 'admin' || r.customerId === user?.id) && (
                  <button onClick={() => deleteReview(r._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                )}
              </div>
              {r.comment && <p className="text-xs text-gray-500 mt-0.5">{r.comment}</p>}
              <p className="text-xs text-gray-300 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Stars }
