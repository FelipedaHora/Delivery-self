import { Head } from '../../components/Head'
import { OrderHeader } from '../../components/OrderHeader'
import React from 'react'
import { Table } from './Table'

import { Container } from './styles'

export default function Main() {
  return (
    <Container>
      <Head title='Carrinho' />
      <OrderHeader />
      <Table />
    </Container>
  )
}
