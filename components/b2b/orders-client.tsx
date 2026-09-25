'use client'

import { useRef, useState } from 'react'
import { Package, RotateCcw, Truck, Upload } from 'lucide-react'
import { demoOrders } from '@/lib/data'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-blue-500/15 text-blue-700',
  processing: 'bg-amber-500/15 text-amber-700',
  shipped: 'bg-teal/15 text-teal',
  delivered: 'bg-medical/15 text-medical',
  cancelled: 'bg-destructive/15 text-destructive',
}

export function OrdersClient() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState('')

  const onImport = (file: File | undefined) => {
    if (!file) return
    setImportMsg(
      `${file.name} alındı — toplu SKU içe aktarma simülasyonu tamamlandı.`,
    )
    setTimeout(() => setImportMsg(''), 4000)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
            Sipariş & envanter
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Sipariş takibi
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Canlı kargo, arşiv ve Excel/CSV toplu sipariş
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => onImport(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-bold dark:bg-card"
          >
            <Upload className="size-4 text-teal" /> Excel / CSV import
          </button>
        </div>
      </div>

      {importMsg && (
        <div className="mt-4 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal">
          {importMsg}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {demoOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-border bg-white p-5 dark:bg-card"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold">{order.number}</h2>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                      statusColors[order.status],
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')} ·{' '}
                  {order.items.length} kalem
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2 border-t border-border pt-4">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Package className="size-3.5 text-muted-foreground" />
                    {item.name}{' '}
                    <span className="text-xs text-muted-foreground">
                      ×{item.quantity}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.sku}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {order.trackingNumber && (
                <div className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs font-semibold">
                  <Truck className="size-3.5 text-teal" />
                  {order.carrier}: {order.trackingNumber}
                </div>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold hover:border-teal"
              >
                <RotateCcw className="size-3.5" /> Yeniden sipariş
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
