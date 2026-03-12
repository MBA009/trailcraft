import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth(){ return useContext(AuthContext) }

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch(e){ return null }
  })
  const [token, setToken] = useState(()=> localStorage.getItem('auth_token') || null)

  useEffect(()=>{
    localStorage.setItem('auth_user', JSON.stringify(user))
  },[user])
  useEffect(()=>{
    if (token) localStorage.setItem('auth_token', token); else localStorage.removeItem('auth_token')
  },[token])

  const api = axios.create();
  api.interceptors.request.use(cfg=>{
    if (token) cfg.headers = { ...(cfg.headers||{}), Authorization: `Bearer ${token}` }
    return cfg
  })

  const login = async (email, password) => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const res = await axios.post(`${url}/api/auth/login`, { email, password })
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (payload) => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const res = await axios.post(`${url}/api/auth/register`, payload)
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => { setToken(null); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
