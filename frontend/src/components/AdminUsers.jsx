import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLE_COLORS = {
  admin:    'bg-orange-100 text-orange-700',
  vendor:   'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
}

export default function AdminUsers({ onClose }) {
  const { api } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState({})

  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    api.get(`${url}/api/admin/users`)
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleBan = async (u) => {
    setToggling(prev => ({ ...prev, [u._id]: true }))
    try {
      await api.post(`${url}/api/admin/ban/${u._id}`, { banned: !u.banned })
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, banned: !x.banned } : x))
    } catch {
      alert('Action failed')
    } finally {
      setToggling(prev => ({ ...prev, [u._id]: false }))
    }
  }

  const admins   = users.filter(u => u.role === 'admin')
  const vendors  = users.filter(u => u.role === 'vendor')
  const customers = users.filter(u => u.role === 'customer')
  const groups = [
    { label: 'Admins', list: admins },
    { label: 'Vendors', list: vendors },
    { label: 'Customers', list: customers },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-900" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-display font-bold text-gray-900">User Management</h3>
            <p className="text-xs text-gray-400 mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''} total</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && <div className="flex items-center justify-center h-24 text-gray-400 text-sm">Loading users…</div>}

          {!loading && groups.map(({ label, list }) => list.length > 0 && (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label} ({list.length})</p>
              <div className="space-y-2">
                {list.map(u => {
                  const initials = (u.name || u.email || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <div key={u._id} className={`flex items-center justify-between rounded-xl p-3 border transition-all ${u.banned ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${u.banned ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600'}`}>
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{u.name || u.email}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                            {u.banned && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Banned</span>}
                          </div>
                          <p className="text-xs text-gray-400">{u.email}</p>
                          {u.storeName && <p className="text-xs text-gray-400">Store: {u.storeName}</p>}
                        </div>
                      </div>
                      {u.role !== 'admin' && (
                        <button
                          disabled={toggling[u._id]}
                          onClick={() => toggleBan(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                            u.banned
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {u.banned ? 'Unban' : 'Ban'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
