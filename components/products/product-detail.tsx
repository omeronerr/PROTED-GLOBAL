'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FilePlus2,
  ShieldCheck,
} from 'lucide-react'
import type { Product } from '@/lib/types'
import {
  CATEGORY_LABELS,
  getProductBySku,
  stockLabel,
} from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { ProductCard } from './product-card'
import { FadeIn, RevealText, Stagger, StaggerItem } from '@/components/motion'
import { cn } from '@/lib/utils'

export function ProductDetail({ product }: { product: Product }) {
  const { addToQuote, addToCart } = useAppStore()
  const [activeVariant, setActiveVariant] = useState(product.variants[0]?.code)
  const [added, setAdded] = useState(false)

  const related = (product.compatibleSkus || [])
    .map((sku) => getProductBySku(sku))
    .filter((p): p is Product => Boolean(p))

  const requestQuote = () => {
    addToQuote(product)
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div>
      {/* Hero band — ethnocare-like immersion */}
      <section className="relative overflow-hidden border-b border-border mesh-bg">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-xs font-bold uppercase tracking-[0.22em] text-teal"
            >
              {CATEGORY_LABELS[product.category]?.en} · {product.sku}
            </motion.div>
            <RevealText
              text={product.name}
              className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-medical md:text-5xl lg:text-6xl dark:text-foreground"
              delay={0.1}
            />
            <FadeIn delay={0.25} className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
              {product.descriptionTr}
            </FadeIn>
            <FadeIn delay={0.35} className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={requestQuote}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-medical px-6 text-sm font-bold text-white shadow-lg shadow-medical/20 transition hover:bg-teal"
              >
                <FilePlus2 className="size-4" />
                {added ? 'Teklife eklendi' : 'Teklif talep et'}
              </button>
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-white/70 px-5 text-sm font-bold backdrop-blur dark:bg-card/70"
              >
                <ExternalLink className="size-4 text-teal" /> PROTED kaynağı
              </a>
            </FadeIn>
            <FadeIn delay={0.45} className="mt-8 flex flex-wrap gap-2">
              {product.kLevels.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur"
                >
                  {k}
                </span>
              ))}
              <span className="rounded-full bg-teal/10 px-3 py-1.5 text-xs font-bold text-teal">
                {stockLabel(product.stockStatus)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-medical/5 px-3 py-1.5 text-xs font-bold text-medical">
                <ShieldCheck className="size-3.5 text-teal" /> CE · ISO 13485
              </span>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} y={60}>
            <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 shadow-2xl shadow-medical/10 backdrop-blur dark:bg-card/60">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain p-12"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Feature pillars */}
      <section className="border-b border-border bg-white dark:bg-card">
        <Stagger className="mx-auto grid max-w-[1440px] md:grid-cols-3">
          {product.features.map((f) => (
            <StaggerItem
              key={f.title}
              className="border-b border-border px-8 py-12 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <h3 className="font-display text-xl font-bold tracking-tight">
                {f.titleTr}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {f.descriptionTr}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Long description + specs */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <FadeIn>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
              Klinik bakış
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Teknik açıklama
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {product.longDescriptionTr}
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground/80">
              {product.longDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {product.materials.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  {m}
                </span>
              ))}
              {product.applicationTypes.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {a}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-3xl border border-border bg-surface/60 p-7">
              <h3 className="font-display text-lg font-bold">Specifications</h3>
              <dl className="mt-5 space-y-0">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between gap-4 border-b border-border/70 py-3.5 last:border-0"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="text-right text-sm font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-teal">
                <CheckCircle2 className="size-4" />
                {product.warranty}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Variants table */}
      {product.variants.length > 0 && (
        <section className="border-y border-border bg-white dark:bg-card">
          <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
            <FadeIn>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                Size / Order codes
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                Varyant seçimi
              </h2>
            </FadeIn>
            <FadeIn delay={0.1} className="mt-8 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5 font-bold">Kod</th>
                    <th className="px-5 py-3.5 font-bold">Açıklama</th>
                    <th className="px-5 py-3.5 font-bold">Meta</th>
                    <th className="px-5 py-3.5 font-bold" />
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr
                      key={v.code}
                      className={cn(
                        'border-t border-border transition hover:bg-muted/40',
                        activeVariant === v.code && 'bg-teal/5',
                      )}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-bold">
                        {v.code}
                      </td>
                      <td className="px-5 py-3.5 font-semibold">{v.label}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {v.meta || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveVariant(v.code)}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-bold',
                            activeVariant === v.code
                              ? 'bg-medical text-white'
                              : 'border border-border hover:border-teal',
                          )}
                        >
                          Seç
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>
            {activeVariant && (
              <p className="mt-4 text-xs text-muted-foreground">
                Seçili sipariş kodu: <strong className="text-foreground">{activeVariant}</strong>
              </p>
            )}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="bg-medical text-medical-foreground">
        <FadeIn className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-5 py-16 lg:flex-row lg:items-center lg:px-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
              Kurumsal tedarik
            </div>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight">
              Fiyatlandırma için resmi teklif alın
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
              Tüm PROTED ürünlerinde fiyatlar klinik anlaşmaya göre belirlenir.
              Teklif talebinizi iletin; satış ekibimiz 24 saat içinde dönüş yapsın.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={requestQuote}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-medical hover:bg-teal hover:text-white"
            >
              <FilePlus2 className="size-4" /> Teklif oluştur
            </button>
            <Link
              href="/b2b/quotes"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-5 text-sm font-bold text-white hover:bg-white/10"
            >
              <Download className="size-4" /> Teklif panelim
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Compatible */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <FadeIn>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
              Uyumluluk
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Önerilen bileşenler
            </h2>
          </FadeIn>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <div className="border-t border-border bg-surface/40 px-5 py-6 text-center text-xs text-muted-foreground lg:px-10">
        <Link href="/products" className="hover:text-teal">
          ← Kataloğa dön
        </Link>
        <span className="mx-3">·</span>
        Kaynak:{' '}
        <a
          href={product.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-teal hover:underline"
        >
          protedglobal.com
        </a>
      </div>
    </div>
  )
}
