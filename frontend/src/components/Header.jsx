import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import Cart from './Cart'
import AdminOrders from './AdminOrders'
import AdminUsers from './AdminUsers'
import AddProductForm from './AddProductForm'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import Profile from './Profile'
import { useAuth } from '../context/AuthContext'

export default function Header(){
  const { items, clear } = useCart()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    clear()
    logout()
    setShowCart(false)
    setShowMobileMenu(false)
    setShowProfile(false)
  }
  const [showCart, setShowCart] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [signupRole, setSignupRole] = useState('customer')
  const [showProfile, setShowProfile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const cartCount = items.reduce((s, i) => s + (i.qty || 1), 0)
  const closeMobile = () => setShowMobileMenu(false)

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-3">

        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-gray-900 flex-shrink-0">
          Trail<span className="text-orange-500">Craft</span>
        </h1>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'vendor' && (
                <button onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 border border-gray-200 hover:border-orange-400 px-3 py-1.5 rounded-lg transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Product
                </button>
              )}
              {user.role === 'admin' && (
                <>
                  <button onClick={() => setShowAdmin(a => !a)} className="text-sm font-medium text-gray-600 hover:text-orange-500 border border-gray-200 hover:border-orange-400 px-3 py-1.5 rounded-lg transition-all">Orders</button>
                  <button onClick={() => setShowUsers(u => !u)} className="text-sm font-medium text-gray-600 hover:text-orange-500 border border-gray-200 hover:border-orange-400 px-3 py-1.5 rounded-lg transition-all">Users</button>
                </>
              )}
              {(user.role === 'customer' || user.role === 'vendor') && (
                <button onClick={() => setShowProfile(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 border border-gray-200 hover:border-orange-400 px-3 py-1.5 rounded-lg transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  My Orders
                </button>
              )}
              <button onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-sm">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold uppercase">{(user.email || 'U')[0]}</span>
                <span className="text-gray-700 font-medium max-w-[120px] truncate">{user.email}</span>
              </button>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-400 transition-all">Log in</button>
              <button onClick={() => { setShowSignup(true); setSignupRole('customer') }} className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg shadow-sm transition-all">Sign up</button>
              <button onClick={() => { setShowSignup(true); setSignupRole('vendor') }} className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-white border border-orange-400 hover:bg-orange-500 px-3 py-1.5 rounded-lg transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11"/></svg>
                Sell with us
              </button>
            </>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Cart (always visible) */}
          <button onClick={() => setShowCart(s => !s)}
            className="relative flex items-center gap-1.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>
          {/* Hamburger */}
          <button onClick={() => setShowMobileMenu(m => !m)}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
            {showMobileMenu
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            }
          </button>
        </div>

        {/* Desktop cart */}
        <button onClick={() => setShowCart(s => !s)}
          className="hidden sm:flex relative items-center gap-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 px-4 py-1.5 rounded-lg transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {user ? (
            <>
              <div className="flex items-center gap-2 py-2 px-1 mb-1">
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold uppercase">{(user.email || 'U')[0]}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
              {user.role === 'vendor' && (
                <button onClick={() => { setShowAdd(true); closeMobile() }}
                  className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2.5 rounded-xl transition-all text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Product
                </button>
              )}
              {user.role === 'admin' && (
                <>
                  <button onClick={() => { setShowAdmin(true); closeMobile() }}
                    className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2.5 rounded-xl transition-all text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Orders
                  </button>
                  <button onClick={() => { setShowUsers(true); closeMobile() }}
                    className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2.5 rounded-xl transition-all text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Users
                  </button>
                </>
              )}
              {(user.role === 'customer' || user.role === 'vendor') && (
                <button onClick={() => { setShowProfile(true); closeMobile() }}
                  className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2.5 rounded-xl transition-all text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  My Orders
                </button>
              )}
              <button onClick={() => { setShowProfile(true); closeMobile() }}
                className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-xl transition-all text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Profile
              </button>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-sm font-medium text-red-500 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-all text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => { setShowLogin(true); closeMobile() }}
                className="w-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-400 px-3 py-2.5 rounded-xl transition-all text-left">
                Log in
              </button>
              <button onClick={() => { setShowSignup(true); setSignupRole('customer'); closeMobile() }}
                className="w-full text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3 py-2.5 rounded-xl shadow-sm transition-all text-left">
                Sign up free
              </button>
              <button onClick={() => { setShowSignup(true); setSignupRole('vendor'); closeMobile() }}
                className="w-full flex items-center gap-2 text-sm font-medium text-orange-600 border border-orange-300 hover:bg-orange-50 px-3 py-2.5 rounded-xl transition-all text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11"/></svg>
                Sell with us
              </button>
            </>
          )}
        </div>
      )}

      {showCart && <Cart onClose={() => setShowCart(false)} />}
      {showAdmin && <AdminOrders onClose={() => setShowAdmin(false)} />}
      {showUsers && <AdminUsers onClose={() => setShowUsers(false)} />}
      {showAdd && <AddProductForm onClose={() => setShowAdd(false)} onCreated={() => setShowAdd(false)} />}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setSignupRole('customer'); setShowSignup(true) }} />}
      {showSignup && <SignupForm onClose={() => setShowSignup(false)} defaultRole={signupRole} onSwitchToLogin={() => setShowLogin(true)} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </header>
  )
}
