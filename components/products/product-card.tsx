'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, Eye, FilePlus2, FileText } from 'lucide-react'
import type { Product } from '@/lib/types'
import { CATEGORY_LABELS, stockLabel } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { QuickView } from './quick-view'

export function ProductCard({ product }: { product: Product }) {
  const { mode, addToQuote } = useAppStore()
  const [quickOpen, setQuickOpen] = useState(false)

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-white transition duration-700 hover:-translate-y-1.5 hover:border-teal/30 hover:shadow-[0_24px_60px_-28px_rgba(15,41,66,0.35)] dark:bg-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8 transition duration-[1.1s] ease-out group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-medical backdrop-blur dark:bg-card/90 dark:text-foreground">
              {CATEGORY_LABELS[product.category]?.tr ?? product.categoryName ?? product.category}
            </span>
            {product.new && (
              <span className="rounded-full bg-teal px-2.5 py-1 text-[10px] font-bold text-white">
                Yeni
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-0 transition duration-500 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              className="flex size-9 items-center justify-center rounded-xl bg-white/95 text-medical shadow-md backdrop-blur hover:bg-teal hover:text-white dark:bg-card"
              aria-label="Hızlı bakış"
            >
              <Eye className="size-4" />
            </button>
            {product.pdfUrl && (
              <a
                href={product.pdfUrl}
                className="flex size-9 items-center justify-center rounded-xl bg-white/95 text-medical shadow-md backdrop-blur hover:bg-teal hover:text-white dark:bg-card"
                aria-label="Teknik PDF"
              >
                <FileText className="size-4" />
              </a>
            )}
          </div>
          <div
            className={cn(
              'absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold',
              product.stockStatus === 'in_stock' && 'bg-teal/15 text-teal',
              product.stockStatus === 'low_stock' && 'bg-amber-500/15 text-amber-700',
              product.stockStatus === 'preorder' && 'bg-blue-500/15 text-blue-700',
              product.stockStatus === 'out_of_stock' && 'bg-destructive/15 text-destructive',
            )}
          >
            {stockLabel(product.stockStatus)}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            {product.sku}
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-1.5 min-h-12 font-display text-base font-bold leading-snug tracking-tight transition hover:text-teal">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {product.descriptionTr}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {product.kLevels.map((k) => (
              <span
                key={k}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground"
              >
                {k}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-5">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-medical transition hover:text-teal dark:text-foreground"
            >
              Detay <ArrowUpRight className="size-3.5" />
            </Link>
            <div className="flex gap-1.5">
              {(mode === 'b2b' || true) && (
                <button
                  type="button"
                  onClick={() => addToQuote(product)}
                  className="flex size-10 items-center justify-center rounded-xl border border-border text-medical transition hover:border-teal hover:bg-teal/5 dark:text-foreground"
                  aria-label="Teklif talebi"
                  title="Teklif talebi"
                >
                  <FilePlus2 className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      <QuickView product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  )
}
