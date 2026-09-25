import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CatalogClient } from '@/components/products/catalog-client'

export const metadata: Metadata = {
  title: 'Ürün Kataloğu',
  description: 'PROTED protez, ortez ve klinik teknoloji kataloğu.',
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-5 py-20 text-center text-sm text-muted-foreground">
          Katalog yükleniyor…
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  )
}
