import type { Metadata } from 'next'
import { OrdersClient } from '@/components/b2b/orders-client'

export const metadata: Metadata = {
  title: 'Siparişler',
}

export default function OrdersPage() {
  return <OrdersClient />
}
