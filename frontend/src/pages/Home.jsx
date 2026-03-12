import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
  { key: 'children', label: 'Children' },
]

export default function Home(){
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(()=>{
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    axios.get(`${url}/api/products`).then(r => setProducts(r.data)).catch(()=>{})
  },[])

  const filtered = products.filter(p => {
    const matchesQ = (p.name||'').toLowerCase().includes(q.toLowerCase()) || (p.brand||'').toLowerCase().includes(q.toLowerCase())
    const matchesCat = category === 'all' || p.category === category
    return matchesQ && matchesCat
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">New Season Collection</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
              Find Your <span className="text-orange-500">Perfect Pair</span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm max-w-md">Curated selection from trusted vendors. Free returns on all orders over $100.</p>
          </div>
          <div className="relative w-full md:w-72">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search shoes or brands…"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`flex-shrink-0 px-5 py-2.5 text-sm font-semibold rounded-full transition-all ${category === c.key ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              {c.label}
            </button>
          ))}
          <span className="ml-auto flex-shrink-0 text-xs text-gray-400 pr-1">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <svg className="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-gray-400 font-medium">No products found</p>
            <button onClick={() => { setQ(''); setCategory('all') }} className="text-orange-500 text-sm font-semibold hover:text-orange-600">Clear filters</button>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </section>
        )}
      </div>
    </div>
  )
}
