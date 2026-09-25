import type { Metadata } from 'next'
import { HomeRedesign } from '@/components/home/redesign'

export const metadata: Metadata = {
  title: 'Hareketin Ötesinde',
  description:
    'PROTED Global protez ve ortez teknolojileri. Karbon ayak, diz eklemi, liner ve üst ekstremite çözümlerini keşfedin.',
}

export default function HomePage() {
  return <HomeRedesign />
}

