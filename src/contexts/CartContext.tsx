import { createContext, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import React from 'react'
import { CustomerData } from '../interfaces/CustomerData'
import { SnackData } from '../interfaces/SnackData'

import { snackEmoji } from '../helpers/snackEmoji'

interface Snack extends SnackData {
  quantity: number
  subtotal: number
}

interface CartContextProps {
  cart: Snack[]
  addSnackIntoCart: (snack: SnackData) => void
  removeSnackFromCart: (snack: Snack) => void
  snackCartIncrement: (snack: Snack) => void
  snackCartDecrement: (snack: Snack) => void
  confirmOrder: () => void
  payOrder: (customer: CustomerData) => void
}

interface CartProviderProps {
  children: ReactNode
}

export const CartContext = createContext({} as CartContextProps)

const localStorageKey= '@DeliverySelf:cart'

export function CartProvider({ children }: CartProviderProps) {
  const navigate = useNavigate()
  const [cart, setCart] = useState<Snack[]>(() => {
    const value = localStorage.getItem('@DeliverySelf:cart')
    if(value) return JSON.parse(value)

    return []
  })

  function saveCart(items: Snack[]) {
    setCart(items)
    localStorage.setItem(localStorageKey, JSON.stringify(items))
  }

  function clearCart(){
    localStorage.removeItem(localStorageKey)
  }

  function addSnackIntoCart(snack: SnackData): void {
    const snackExistentInCart = cart.find(
      (item) => item.snack === snack.snack && item.id === snack.id,
    )

    if (snackExistentInCart) {
      const newCart = cart.map((item) => {
        if (item.id === snack.id) {
          const quantity = item.quantity + 1
          const subtotal = item.price * quantity

          return { ...item, quantity, subtotal }
        }

        return item
      })

      toast.success(`Outro(a) ${snackEmoji(snack.snack)} ${snack.name} adicionado nos pedidos!`)
      saveCart(newCart)

      return
    }

    const newSnack = { ...snack, quantity: 1, subtotal: snack.price }
    const newCart = [...cart, newSnack] // push de um array

    toast.success(`${snackEmoji(snack.snack)} ${snack.name} adicionado nos pedidos!`)
    saveCart(newCart)
  }

  function removeSnackFromCart(snack: Snack) {
    const newCart = cart.filter((item) => !(item.id === snack.id && item.snack === snack.snack))

    saveCart(newCart)
  }

  function updateSnackQuantity(snack: Snack, newQuantity: number) {
    if (newQuantity <= 0) return

    const snackExistentInCart = cart.find(
      (item) => item.id === snack.id && item.snack === snack.snack,
    )

    if (!snackExistentInCart) return

    const newCart = cart.map((item) => {
      if (item.id === snackExistentInCart.id && item.snack === snackExistentInCart.snack) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.price * newQuantity,
        }
      }

      return item
    })

    saveCart(newCart)
  }

  function snackCartIncrement(snack: Snack) {
    updateSnackQuantity(snack, snack.quantity + 1)
  }

  function snackCartDecrement(snack: Snack) {
    updateSnackQuantity(snack, snack.quantity - 1)
  }

  function confirmOrder() {
    navigate('/payment')
  }

  function payOrder(customer: CustomerData) {
    console.log('payOrder', cart, customer)

    clearCart()// Limpa o localStorage(carrinho) para que seja possível fazer uma nova compra
    // chamada de API para o backend

    return
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addSnackIntoCart,
        removeSnackFromCart,
        snackCartIncrement,
        snackCartDecrement,
        confirmOrder,
        payOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
