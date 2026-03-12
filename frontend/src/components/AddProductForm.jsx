import React, { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AddProductForm({ onClose, onCreated }){
  const { api } = useAuth()
  const [payload, setPayload] = useState({ name: '', brand: '', price: '', description: '', sizes: '', category: 'men' })
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const change = (k, v) => setPayload(p => ({ ...p, [k]: v }))

  const handleFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr(null)
    setPreview(URL.createObjectURL(f))
    setUploading(true)
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const dataUrl = await new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result)
        reader.onerror = rej
        reader.readAsDataURL(f)
      })
      const resp = await api.post(`${base}/api/upload/base64`, { filename: f.name, data: dataUrl })
      setImageUrl(resp.data.url)
    } catch (e) {
      setErr(e.response?.data?.message || 'Image upload failed')
      setPreview(null)
    } finally { setUploading(false) }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!payload.name || !payload.price) { setErr('Name and price are required'); return }
    if (!imageUrl) { setErr('Please upload a product image'); return }
    setLoading(true); setErr(null)
    try {
      const body = {
        ...payload,
        price: parseFloat(payload.price),
        sizes: payload.sizes.split(',').map(s => s.trim()).filter(Boolean),
        image: imageUrl
      }
      const res = await api.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/products', body)
      onCreated?.(res.data)
      onClose?.()
    } catch (err) { setErr(err.response?.data?.message || err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-900 flex-shrink-0" />

        <div className="p-5 sm:p-7 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">Add New Product</h2>
              <p className="text-sm text-gray-400 mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {err && (
            <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Image upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Product Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex items-center justify-center overflow-hidden
                  ${preview ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'}`}
                style={{ height: '140px' }}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className="h-full w-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                      <span className="opacity-0 hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">Change image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center pointer-events-none">
                    {uploading ? (
                      <div className="text-sm text-orange-500 font-medium">Uploading…</div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <p className="text-sm text-gray-400">Click to upload a photo</p>
                        <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
            </div>

            {/* Name + Brand */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Name *</label>
                <input value={payload.name} onChange={e => change('name', e.target.value)} placeholder="Air Max Pro"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Brand</label>
                <input value={payload.brand} onChange={e => change('brand', e.target.value)} placeholder="Nike"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              </div>
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Price ($) *</label>
                <input type="number" min="0" step="0.01" value={payload.price} onChange={e => change('price', e.target.value)} placeholder="99.99"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
                <select value={payload.category} onChange={e => change('category', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white">
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="children">Children</option>
                </select>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Sizes</label>
              <input value={payload.sizes} onChange={e => change('sizes', e.target.value)} placeholder="7, 8, 9, 10, 11"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              <p className="text-xs text-gray-400 mt-1">Enter sizes separated by commas</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea value={payload.description} onChange={e => change('description', e.target.value)} placeholder="Describe your product…" rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none" />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 hover:border-gray-400 font-semibold py-2.5 rounded-xl text-sm transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading || uploading}
                className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                {loading ? 'Adding…' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
