'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { MENU_GROUPS, categories, getCategory } from '@/lib/data'
import { cn } from '@/lib/utils'

export function CategoryMegaMenu({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean
  onNavigate?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(MENU_GROUPS[0]?.id)

  if (mobile) {
    return (
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Kategoriler
        </div>
        {MENU_GROUPS.map((g) => (
          <div key={g.id} className="border-b border-border/50 pb-2">
            <div className="px-3 py-1.5 text-xs font-bold text-teal">{g.titleTr}</div>
            {g.categoryIds.map((id) => {
              const c = getCategory(id)
              if (!c) return null
              return (
                <Link
                  key={id}
                  href={`/products?category=${id}`}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
                >
                  {c.nameTr}
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    ({c.count ?? 0})
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
        <Link
          href="/products"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-sm font-bold text-teal"
        >
          Tüm ürünler →
        </Link>
      </div>
    )
  }

  const group = MENU_GROUPS.find((g) => g.id === activeGroup) || MENU_GROUPS[0]
  const groupCats = group.categoryIds
    .map((id) => getCategory(id))
    .filter(Boolean)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
          open
            ? 'bg-muted text-medical dark:text-foreground'
            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        )}
        aria-expanded={open}
      >
        Ürünler <ChevronDown className={cn('size-3.5 transition', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 pt-3"
          >
            <div className="flex w-[min(920px,90vw)] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-medical/15 dark:bg-card">
              <aside className="w-52 shrink-0 border-r border-border bg-surface/80 p-3">
                {MENU_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onMouseEnter={() => setActiveGroup(g.id)}
                    onClick={() => setActiveGroup(g.id)}
                    className={cn(
                      'mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
                      activeGroup === g.id
                        ? 'bg-medical text-white'
                        : 'hover:bg-white dark:hover:bg-muted',
                    )}
                  >
                    {g.titleTr}
                  </button>
                ))}
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-xl px-3 py-2.5 text-xs font-bold text-teal hover:bg-white"
                >
                  Tüm katalog ({categories.reduce((s, c) => s + (c.count || 0), 0)})
                </Link>
              </aside>

              <div className="grid flex-1 grid-cols-2 gap-1 p-4 sm:grid-cols-3">
                {groupCats.map((c) =>
                  c ? (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-muted/60"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image
                          src={c.image || '/placeholder.svg'}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold group-hover:text-teal">
                          {c.nameTr}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {c.count ?? 0} ürün
                        </div>
                      </div>
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
