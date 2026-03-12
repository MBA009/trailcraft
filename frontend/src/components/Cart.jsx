import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart({ onClose }){
  const { items, remove, updateQty, clear } = useCart()
  const { user, api } = useAuth()
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    email: user?.email || ''
  })
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)

  const total = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0).toFixed(2)
  const handleChange = (e) => setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const placeOrder = async () => {
    if (!items.length) return
    setLoading(true)
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    try {
      const payload = {
        items: items.map(i => ({ productId: i._id, name: i.name, price: i.price, qty: i.qty, size: i.size })),
        total: parseFloat(total),
        shipping
      }
      const res = await api.post(`${url}/api/orders`, payload)
      setOrder(res.data)
      clear()
    } catch (err) {
      console.error(err)
      alert('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-full sm:max-w-md bg-white h-full flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900">Your Cart</h2>
            <p className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Order success */}
        {order && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">Order placed!</p>
              <p className="text-sm text-gray-500 mt-1">Order ID: <span className="font-mono text-xs">{order._id}</span></p>
              <p className="text-sm text-gray-500">Total: <span className="font-semibold">${order.total}</span></p>
            </div>
            <button
              onClick={() => { setOrder(null); onClose?.() }}
              className="mt-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {!order && !user && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Sign in to continue</p>
              <p className="text-sm text-gray-400 mt-1">You need an account to place an order</p>
            </div>
            <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
              Back to shop
            </button>
          </div>
        )}

        {!order && user && (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <p className="text-gray-400 text-sm">Your cart is empty</p>
                </div>
              )}
              {items.map(i => (
                <div key={i.cartKey} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                  <img src={i.image} alt={i.name} className="w-16 h-16 object-contain rounded-lg bg-gray-50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{i.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Size: <span className="font-medium text-gray-600">{i.size}</span></p>
                    <p className="text-sm font-bold text-gray-900 mt-1">${(i.price * i.qty).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(i.cartKey, i.qty - 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all text-sm"
                      >−</button>
                      <span className="text-sm font-semibold w-4 text-center">{i.qty}</span>
                      <button
                        onClick={() => updateQty(i.cartKey, i.qty + 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all text-sm"
                      >+</button>
                      <button
                        onClick={() => remove(i.cartKey)}
                        className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors"
                      >Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout section */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-4 sm:px-6 py-4 space-y-3 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Shipping details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input name="name" value={shipping.name} onChange={handleChange} placeholder="Full name" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input name="email" value={shipping.email} onChange={handleChange} placeholder="Email" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input name="address" value={shipping.address} onChange={handleChange} placeholder="Address" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input name="city" value={shipping.city} onChange={handleChange} placeholder="City" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input name="postalCode" value={shipping.postalCode} onChange={handleChange} placeholder="Postal code" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input name="country" value={shipping.country} onChange={handleChange} placeholder="Country" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-xl font-bold text-gray-900">${total}</p>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Placing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
