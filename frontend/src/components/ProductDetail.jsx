import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import SizeGuide from './SizeGuide'

export default function ProductDetail({ product, onClose }){
  const { add } = useCart()
  const { user } = useAuth()
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    if (!user) { setShowLogin(true); return }
    if (!selectedSize) return
    add(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const img = product.image || 'https://via.placeholder.com/800x600?text=No+Image'

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-50" onClick={onClose}>
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row max-h-[92vh] sm:max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Image */}
          <div className="bg-gray-50 md:w-5/12 flex items-center justify-center p-4 md:p-6 flex-shrink-0">
            <img src={img} alt={product.name} className="max-h-44 sm:max-h-64 md:max-h-72 w-full object-contain" />
          </div>

          {/* Info */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">{product.brand}</p>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">{product.name}</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors ml-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <p className="text-2xl font-bold text-gray-900 mt-3">${product.price}</p>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">{product.description}</p>

            {/* Size picker */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">
                  Select Size
                  {!selectedSize && <span className="text-orange-500 ml-1">*</span>}
                </p>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-orange-500 hover:text-orange-700 underline transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || []).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-lg border text-sm font-semibold transition-all
                      ${selectedSize === s
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth gate / Add to cart */}
            <div className="mt-6">
              {!user ? (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Sign in to add to cart</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setShowSignup(false); setShowLogin(true) }}
                      className="flex-1 text-sm font-semibold border border-gray-300 hover:border-gray-900 px-4 py-2 rounded-lg transition-all">
                      Log in
                    </button>
                    <button onClick={() => { setShowLogin(false); setShowSignup(true) }}
                      className="flex-1 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all">
                      Sign up
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={!selectedSize}
                  className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all
                    ${selectedSize
                      ? added
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-900 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {added ? '✓ Added to Cart' : selectedSize ? `Add to Cart — Size ${selectedSize}` : 'Select a size first'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupForm onClose={() => setShowSignup(false)} defaultRole="customer" />}
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </>
  )
}
