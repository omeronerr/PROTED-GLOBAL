'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { CATEGORY_LABELS, products, stockLabel, categories } from '@/lib/data'
import type { KLevel, StockStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/motion'

const stockStatuses: StockStatus[] = [
  'in_stock',
  'low_stock',
  'preorder',
  'out_of_stock',
]

const kLevelOptions: KLevel[] = ['K1', 'K2', 'K3', 'K4']

const materialOptions = Array.from(
  new Set(products.flatMap((p) => p.materials).filter(Boolean)),
).sort()

export function CatalogClient() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')

  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [category, setCategory] = useState<string>(
    initialCategory && CATEGORY_LABELS[initialCategory] ? initialCategory : 'all',
  )
  const [selectedStock, setSelectedStock] = useState<StockStatus[]>([])
  const [selectedK, setSelectedK] = useState<KLevel[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    const c = searchParams.get('category')
    if (c && CATEGORY_LABELS[c]) setCategory(c)
  }, [searchParams])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category && p.categorySlug !== category)
        return false
      if (selectedStock.length && !selectedStock.includes(p.stockStatus)) return false
      if (selectedK.length && !selectedK.some((k) => p.kLevels.includes(k))) return false
      if (
        selectedMaterials.length &&
        !selectedMaterials.some((m) =>
          p.materials.some((pm) => pm.toLowerCase().includes(m.toLowerCase())),
        )
      )
        return false
      if (
        query &&
        !`${p.name} ${p.nameTr} ${p.sku} ${p.description} ${p.categoryName}`
          .toLowerCase()
          .includes(query)
      )
        return false
      return true
    })
  }, [category, selectedStock, selectedK, selectedMaterials, q])

  const toggle = <T,>(arr: T[], value: T, set: (v: T[]) => void) => {
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  const activeLabel =
    category === 'all' ? 'Tüm ürünler' : CATEGORY_LABELS[category]?.tr || category

  const clearFilters = () => {
    setSelectedStock([])
    setSelectedK([])
    setSelectedMaterials([])
    setCategory('all')
    setQ('')
  }

  return (
    <div>
      <section className="relative border-b border-border mesh-bg">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
        <FadeIn className="relative mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
          <div className="eyebrow">Product catalog · {categories.length} kategori</div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            {activeLabel}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            K-Level, malzeme ve stok ile filtreleyin — {products.length} ürün, fiyatlar
            teklifle belirlenir.
          </p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="İsim, SKU, klinik kod veya kategori…"
            className="mt-6 h-12 w-full max-w-md rounded-xl border border-border bg-white/80 px-4 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 dark:bg-card"
          />
        </FadeIn>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> ürün
            {(selectedK.length > 0 || selectedMaterials.length > 0) && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-3 text-xs font-bold text-teal hover:underline"
              >
                Filtreleri temizle
              </button>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filtreler
            </button>
            <div className="flex rounded-xl border border-border p-1">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'rounded-lg p-2',
                  view === 'grid' ? 'bg-medical text-white' : 'hover:bg-muted',
                )}
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'rounded-lg p-2',
                  view === 'list' ? 'bg-medical text-white' : 'hover:bg-muted',
                )}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside
            className={cn(
              'max-h-[75vh] space-y-6 overflow-y-auto rounded-2xl border border-border bg-white p-5 dark:bg-card',
              filtersOpen ? 'block' : 'hidden lg:block',
            )}
          >
            <FilterGroup title="Kategori">
              <Chip
                active={category === 'all'}
                onClick={() => setCategory('all')}
                label={`Tümü (${products.length})`}
              />
              {categories
                .filter((c) => (c.count ?? 0) > 0)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <Chip
                    key={c.id}
                    active={category === c.id}
                    onClick={() => setCategory(c.id)}
                    label={`${c.nameTr} (${c.count})`}
                  />
                ))}
            </FilterGroup>

            <FilterGroup title="Aktivite / K-Level">
              {kLevelOptions.map((k) => (
                <Chip
                  key={k}
                  active={selectedK.includes(k)}
                  onClick={() => toggle(selectedK, k, setSelectedK)}
                  label={k}
                />
              ))}
            </FilterGroup>

            {materialOptions.length > 0 && (
              <FilterGroup title="Malzeme">
                {materialOptions.slice(0, 12).map((m) => (
                  <Chip
                    key={m}
                    active={selectedMaterials.includes(m)}
                    onClick={() => toggle(selectedMaterials, m, setSelectedMaterials)}
                    label={m}
                  />
                ))}
              </FilterGroup>
            )}

            <FilterGroup title="Stok">
              {stockStatuses.map((s) => (
                <Chip
                  key={s}
                  active={selectedStock.includes(s)}
                  onClick={() => toggle(selectedStock, s, setSelectedStock)}
                  label={stockLabel(s)}
                />
              ))}
            </FilterGroup>
          </aside>

          <div>
            {view === 'grid' ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 transition hover:border-teal/40 sm:flex-row sm:items-center dark:bg-card"
                  >
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-muted-foreground">
                        {p.sku}
                      </div>
                      <div className="font-display text-base font-bold">{p.name}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.kLevels.map((k) => (
                          <span
                            key={k}
                            className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {p.descriptionTr || p.description}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-teal">
                      {stockLabel(p.stockStatus)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border py-20 text-center">
                <p className="font-semibold">Sonuç bulunamadı</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-sm font-bold text-teal hover:underline"
                >
                  Filtreleri sıfırla
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition',
        active
          ? 'bg-medical text-white'
          : 'bg-muted text-muted-foreground hover:bg-muted/80',
      )}
    >
      {label}
    </button>
  )
}
