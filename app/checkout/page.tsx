'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'
import { demoCompany } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const steps = ['Sepet', 'Teslimat', 'Onay talebi', 'Tamam'] as const

export default function CheckoutPage() {
  const { cart, clearCart, mode } = useAppStore()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-teal/15 text-teal">
          <Check className="size-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Talep alındı</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sipariş/teklif talebiniz satış ekibine iletildi. Resmi fiyatlandırma
          teklif PDF&apos;i ile paylaşılacaktır.
          {mode === 'b2b' && ' ERP kancaları (SAP / Logo) hazırlık durumuna göre tetiklenir.'}
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-11 items-center rounded-xl bg-medical px-5 text-sm font-bold text-white"
        >
          Kataloğa dön
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Sepet boş</h1>
        <Link href="/products" className="mt-6 inline-block text-sm font-bold text-teal">
          Ürünlere git →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Sipariş / Teklif talebi
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Fiyatlar klinik anlaşmaya göre belirlenir — ödeme adımı yoktur.
      </p>

      <ol className="mt-8 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 text-xs font-bold">
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full',
                i <= step ? 'bg-medical text-white' : 'bg-muted text-muted-foreground',
              )}
            >
              {i + 1}
            </span>
            <span className={i <= step ? 'text-foreground' : 'text-muted-foreground'}>
              {s}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight className="size-3.5 text-muted-foreground" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl border border-border bg-white p-6 dark:bg-card">
        {step === 0 && (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} ×{item.quantity}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.sku}
                </span>
              </li>
            ))}
          </ul>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold">
              Klinik / Firma
              <input
                defaultValue={demoCompany.name}
                className="mt-2 h-11 w-full rounded-xl border border-border px-3 text-sm"
              />
            </label>
            <label className="block text-xs font-bold">
              Teslimat adresi
              <textarea
                rows={3}
                defaultValue="İvedik OSB, Ankara"
                className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 text-sm">
            <p className="leading-6 text-muted-foreground">
              Talebiniz onaylandığında resmi teklif PDF&apos;i e-posta ile
              iletilecektir. Ödeme ve faturalandırma kurumsal sözleşmenize göre
              yürütülür.
            </p>
            <div className="rounded-xl bg-surface px-4 py-3 text-xs">
              ERP: SAP {demoCompany.erpReady.sap ? '✓' : '–'} · Logo{' '}
              {demoCompany.erpReady.logo ? '✓' : '–'} · Mikro{' '}
              {demoCompany.erpReady.mikro ? '✓' : '–'}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>{cart.length}</strong> ürün kalemi ·{' '}
              <strong>{cart.reduce((s, i) => s + i.quantity, 0)}</strong> adet
            </p>
            <p className="text-muted-foreground">
              Onay ile satış ekibine talep açılır.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold disabled:opacity-40"
          >
            Geri
          </button>
          <button
            type="button"
            onClick={() => {
              if (step < steps.length - 1) setStep((s) => s + 1)
              else {
                clearCart()
                setDone(true)
              }
            }}
            className="rounded-xl bg-medical px-5 py-2.5 text-sm font-bold text-white hover:bg-teal"
          >
            {step === steps.length - 1 ? 'Talebi gönder' : 'Devam'}
          </button>
        </div>
      </div>
    </div>
  )
}
