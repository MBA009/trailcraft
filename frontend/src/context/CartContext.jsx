import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function useCart(){
  return useContext(CartContext)
}

export function CartProvider({ children }){
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')||'[]') } catch(e){ return [] }
  })

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(items))
  },[items])

  // keyed by _id+size so same shoe in different sizes are separate entries
  const add = (product, size) => {
    const key = `${product._id}-${size}`
    setItems(prev => {
      const found = prev.find(i => i.cartKey === key)
      if (found) return prev.map(i => i.cartKey === key ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, size, cartKey: key, qty: 1 }]
    })
  }

  const updateQty = (cartKey, qty) => {
    if (qty < 1) return
    setItems(prev => prev.map(i => i.cartKey === cartKey ? { ...i, qty } : i))
  }

  const remove = (cartKey) => setItems(prev => prev.filter(i => i.cartKey !== cartKey))
  const clear = () => setItems([])

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
