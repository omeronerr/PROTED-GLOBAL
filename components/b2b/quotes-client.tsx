'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Download,
  FilePlus2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { demoCompany } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-500/15 text-blue-700',
  revised: 'bg-amber-500/15 text-amber-700',
  approved: 'bg-teal/15 text-teal',
  converted: 'bg-medical/15 text-medical',
  rejected: 'bg-destructive/15 text-destructive',
}

export function QuotesClient() {
  const {
    quotes,
    quoteDraft,
    updateQuoteQty,
    removeFromQuote,
    saveQuote,
    clearQuoteDraft,
    cart,
  } = useAppStore()
  const [notes, setNotes] = useState('')
  const [toast, setToast] = useState('')

  // Sync cart items into quote draft helper
  const importCart = () => {
    // cart items already may be in quote - user adds via product pages
    setToast(
      cart.length
        ? `${cart.length} sepet kalemi mevcut — ürün sayfalarından teklife ekleyin veya taslağı kaydedin.`
        : 'Sepet boş',
    )
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = () => {
    if (!quoteDraft.length) return
    const q = saveQuote(notes)
    setNotes('')
    setToast(`${q.number} taslak olarak kaydedildi`)
    setTimeout(() => setToast(''), 3000)
  }

  const convertToOrder = (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId)
    if (!quote) return
    setToast(`${quote.number} siparişe dönüştürüldü (demo)`)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
            Teklif hazırlama
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Instant Quote Builder
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {demoCompany.name} antetli PDF · fiyatlar teklifte belirlenir · revizyon geçmişi
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={importCart}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold"
          >
            Sepeti kontrol et
          </button>
          <Link
            href="/products"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-medical px-4 text-sm font-bold text-white"
          >
            <FilePlus2 className="size-4" /> Kataloğa ürün ekle
          </Link>
        </div>
      </div>

      {toast && (
        <div className="mt-4 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal">
          {toast}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
          <h2 className="font-display text-lg font-bold">Aktif taslak</h2>
          {quoteDraft.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Katalogdan “Teklif” ile ürün seçin. Fiyatlar teklif onayında iletilir.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {quoteDraft.map((line) => (
                <li
                  key={line.productId}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold">{line.name}</div>
                    <div className="text-[11px] text-muted-foreground">{line.sku}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        className="p-1.5"
                        onClick={() =>
                          updateQuoteQty(line.productId, line.quantity - 1)
                        }
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="p-1.5"
                        onClick={() =>
                          updateQuoteQty(line.productId, line.quantity + 1)
                        }
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromQuote(line.productId)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <label className="mt-5 block text-xs font-bold">
            Notlar
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              placeholder="Klinik not, boyut dağılımı, teslimat tercihi…"
            />
          </label>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <div className="text-xs text-muted-foreground">
              {quoteDraft.length} kalem · fiyat teklifte
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearQuoteDraft}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!quoteDraft.length}
                className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
              >
                PDF taslak kaydet
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
          <h2 className="font-display text-lg font-bold">Teklif arşivi</h2>
          <ul className="mt-4 space-y-3">
            {quotes.map((q) => (
              <li key={q.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold">{q.number}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Rev {q.revision} · {q.lines.length} kalem ·{' '}
                      {new Date(q.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                      statusColors[q.status],
                    )}
                  >
                    {q.status}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {q.lines.map((l) => (
                    <li key={l.sku}>
                      {l.name} ×{l.quantity}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[11px] font-bold"
                  >
                    <Download className="size-3.5" /> PDF
                  </button>
                  {q.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => convertToOrder(q.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-medical px-3 py-1.5 text-[11px] font-bold text-white"
                    >
                      <ShoppingCart className="size-3.5" /> Siparişe dönüştür
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
