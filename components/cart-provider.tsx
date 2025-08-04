"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  maxStock: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any) => boolean
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => boolean
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("optic-proline-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("optic-proline-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: any): boolean => {
    const existingItem = items.find((item) => item.id === product.id)

    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        return false // Stock insuffisant
      }
      setItems(items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      if (product.stock_quantity <= 0) {
        return false // Pas de stock
      }
      setItems([
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.unit_price,
          quantity: 1,
          maxStock: product.stock_quantity,
        },
      ])
    }
    return true
  }

  const removeFromCart = (productId: number) => {
    setItems(items.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number): boolean => {
    const item = items.find((item) => item.id === productId)
    if (!item || quantity > item.maxStock || quantity < 1) {
      return false
    }

    setItems(items.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    return true
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
