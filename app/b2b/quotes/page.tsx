import type { Metadata } from 'next'
import { QuotesClient } from '@/components/b2b/quotes-client'

export const metadata: Metadata = {
  title: 'Teklifler',
}

export default function QuotesPage() {
  return <QuotesClient />
}
