import type { Metadata } from 'next'
import { B2BDashboard } from '@/components/b2b/dashboard'

export const metadata: Metadata = {
  title: 'B2B Kurumsal Portal',
}

export default function B2BPage() {
  return <B2BDashboard />
}
