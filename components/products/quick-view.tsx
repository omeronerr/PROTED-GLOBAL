'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { FilePlus2, X } from 'lucide-react'
import type { Product } from '@/lib/types'
import { CATEGORY_LABELS, stockLabel } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product
  open: boolean
  onClose: () => void
}) {
  const { addToQuote } = useAppStore()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-medical/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-4 top-[8%] z-[90] mx-auto max-h-[84vh] max-w-3xl overflow-y-auto rounded-3xl border border-border bg-white shadow-2xl dark:bg-card md:inset-x-auto"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-xl bg-muted p-2"
              aria-label="Kapat"
            >
              <X className="size-4" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square bg-surface md:aspect-auto md:min-h-[360px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-10"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="text-xs font-bold uppercase tracking-wider text-teal">
                  {CATEGORY_LABELS[product.category]?.tr}
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                  {product.name}
                </h2>
                <div className="mt-1 text-sm text-muted-foreground">{product.sku}</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {product.descriptionTr}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-2">
                  {product.specs.slice(0, 4).map((s) => (
                    <div key={s.label} className="rounded-xl bg-muted/60 px-3 py-2">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-bold">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-teal">
                    {stockLabel(product.stockStatus)}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="inline-flex h-11 items-center rounded-xl border border-border px-4 text-sm font-bold"
                    >
                      Tam detay
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        addToQuote(product)
                        onClose()
                      }}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-medical px-4 text-sm font-bold text-white hover:bg-teal"
                    >
                      <FilePlus2 className="size-4" /> Teklif
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
