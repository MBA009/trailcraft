import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProductDetail from './ProductDetail'
import EditProductForm from './EditProductForm'

export default function ProductCard({ product: initialProduct }){
  const { user, api } = useAuth()
  const [product, setProduct] = useState(initialProduct)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const remove = async () => {
    if (!confirm('Remove product?')) return
    try {
      setLoading(true)
      await api.delete((import.meta.env.VITE_API_URL || 'http://localhost:5000') + `/api/products/${product._id}`)
      window.location.reload()
    } catch (err) { console.error(err); alert('Delete failed') } finally { setLoading(false) }
  }

  const canEdit = user && (user.role === 'admin' || (product.owner && product.owner === user.id))

  const img = product.image || 'https://via.placeholder.com/600x400?text=No+Image'

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 cursor-pointer flex flex-col h-full" onClick={() => setShow(true)}>
        <div className="bg-gray-50 flex items-center justify-center h-48 md:h-52 relative">
          <img src={img} alt={product.name} className="max-h-full object-contain" />
          {canEdit && (
            <button
              onClick={e => { e.stopPropagation(); setShowEdit(true) }}
              className="absolute top-2 right-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-400 text-gray-500 hover:text-orange-500 p-1.5 rounded-lg shadow-sm transition-all"
              title="Edit product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div>
            <h2 className="font-display text-lg md:text-xl">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <div className="mt-2 flex-1">
            <p className="font-bold text-brand-accent2">${product.price}</p>
            <p className="text-sm mt-2 text-gray-600 line-clamp-3">{product.description}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">Sizes: {product.sizes?.slice(0, 4).join(', ')}</div>
            <div className="flex items-center gap-2">
              {user?.role !== 'vendor' && <button onClick={e => { e.stopPropagation(); setShow(true) }} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">Add</button>}
              {canEdit && <button onClick={e => { e.stopPropagation(); remove() }} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">Delete</button>}
            </div>
          </div>
        </div>
      </div>
      {show && <ProductDetail product={product} onClose={() => setShow(false)} />}
      {showEdit && (
        <EditProductForm
          product={product}
          onClose={() => setShowEdit(false)}
          onUpdated={updated => { setProduct(updated); setShowEdit(false) }}
        />
      )}
    </>
  )
}
