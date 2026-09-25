import type { Metadata } from 'next'
import { MessagesClient } from '@/components/b2b/messages-client'

export const metadata: Metadata = {
  title: 'Mesajlar',
}

export default function MessagesPage() {
  return <MessagesClient />
}
