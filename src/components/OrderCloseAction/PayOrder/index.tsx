import { useCart } from '../../../hooks/useCart'
import React from 'react'
import { currencyFormat } from '../../../helpers/currencyFormat'

import { Container } from '../style'

export function PayOrder() {
  const { cart } = useCart()

  const totalAmount = cart.reduce((acc, item) => (acc += item.subtotal), 0)

  return (
    <Container>
      <button type='submit'>Pagar</button>
      <span>
        Total <strong>{currencyFormat(totalAmount)}</strong>
      </span>
    </Container>
  )
}
