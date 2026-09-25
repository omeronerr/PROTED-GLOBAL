'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  Globe,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { demoNotifications } from '@/lib/data'
import { cartItemCount, useAppStore } from '@/lib/store'
import type { CurrencyCode, LocaleCode, SearchSuggestion } from '@/lib/types'
import { products, CATEGORY_LABELS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CategoryMegaMenu } from '@/components/layout/category-mega-menu'

const currencies: CurrencyCode[] = ['EUR', 'USD', 'TRY', 'GBP']
const locales: { code: LocaleCode; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    mode,
    setMode,
    currency,
    setCurrency,
    locale,
    setLocale,
    cart,
    setCartOpen,
    setSearchOpen,
    searchOpen,
    isAuthenticated,
    login,
  } = useAppStore()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const count = cartItemCount(cart)
  const isB2B = mode === 'b2b' || pathname.startsWith('/b2b')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [setSearchOpen])

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const hits: SearchSuggestion[] = []

    for (const p of products) {
      if (p.name.toLowerCase().includes(q) || p.nameTr.toLowerCase().includes(q)) {
        hits.push({
          type: 'product',
          label: p.name,
          sublabel: p.sku,
          href: `/products/${p.id}`,
        })
      } else if (p.sku.toLowerCase().includes(q)) {
        hits.push({
          type: 'sku',
          label: p.sku,
          sublabel: p.name,
          href: `/products/${p.id}`,
        })
      } else if (p.medicalCode?.toLowerCase().includes(q)) {
        hits.push({
          type: 'medical_code',
          label: p.medicalCode,
          sublabel: p.name,
          href: `/products/${p.id}`,
        })
      }
      if (hits.length >= 6) break
    }

    for (const [key, labels] of Object.entries(CATEGORY_LABELS)) {
      if (
        labels.en.toLowerCase().includes(q) ||
        labels.tr.toLowerCase().includes(q)
      ) {
        hits.push({
          type: 'category',
          label: labels.tr,
          sublabel: labels.en,
          href: `/products?category=${key}`,
        })
      }
    }

    return hits.slice(0, 8)
  }, [query])

  const navLinks = isB2B
    ? [
        { href: '/b2b', label: 'Panel' },
        { href: '/b2b/quotes', label: 'Teklifler' },
        { href: '/b2b/orders', label: 'Siparişler' },
        { href: '/b2b/messages', label: 'Mesajlar' },
      ]
    : [
        { href: '/solutions', label: 'Çözümler' },
        { href: '/about', label: 'Hakkımızda' },
        { href: '/support', label: 'Destek' },
      ]

  const switchMode = (next: 'b2c' | 'b2b') => {
    if (next === 'b2b' && !isAuthenticated) {
      login()
    }
    setMode(next)
    router.push(next === 'b2b' ? '/b2b' : '/')
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-500',
        scrolled
          ? 'border-border/50 glass-strong'
          : 'border-transparent bg-white/70 backdrop-blur-md dark:bg-slate-900/70',
      )}
    >
      <div className="border-b border-border/40 bg-medical text-[11px] text-medical-foreground">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-1.5 lg:px-10">
          <p className="truncate tracking-wide opacity-90">
            ISO 13485 · Profesyonel çözümler, güçlü ortaklıklar
          </p>
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => switchMode('b2c')}
              className={cn(
                'rounded-md px-2.5 py-1 font-semibold transition',
                !isB2B ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white',
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <ShoppingBag className="size-3" /> B2C Perakende
              </span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('b2b')}
              className={cn(
                'rounded-md px-2.5 py-1 font-semibold transition',
                isB2B ? 'bg-teal text-white' : 'text-white/70 hover:text-white',
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-3" /> B2B Kurumsal
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-3.5 lg:px-10">
        <button
          type="button"
          className="rounded-lg p-2 lg:hidden"
          aria-label="Menü"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href={isB2B ? '/b2b' : '/'} className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-medical text-lg font-black text-white shadow-lg shadow-medical/20">
            P
          </div>
          <div className="leading-none">
            <div className="font-display text-[18px] font-bold tracking-tight text-medical dark:text-foreground">
              PROTED
            </div>
            <div className="text-[9px] font-semibold tracking-[0.32em] text-muted-foreground">
              GLOBAL
            </div>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {!isB2B && <CategoryMegaMenu />}
          {isB2B && (
            <Link
              href="/products"
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-semibold transition',
                pathname.startsWith('/products')
                  ? 'bg-muted text-medical dark:text-foreground'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )}
            >
              Katalog
            </Link>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-semibold transition',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'bg-muted text-medical dark:text-foreground'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative ml-auto hidden min-w-0 flex-1 max-w-md md:block" ref={searchRef}>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Ürün, SKU, kategori veya medikal kod..."
            className="h-10 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20 dark:focus:bg-card"
          />
          <AnimatePresence>
            {searchOpen && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-white shadow-xl shadow-medical/10 dark:bg-card"
              >
                {suggestions.map((s) => (
                  <Link
                    key={`${s.type}-${s.label}`}
                    href={s.href}
                    onClick={() => {
                      setSearchOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3 text-sm last:border-0 hover:bg-muted/60"
                  >
                    <div>
                      <div className="font-semibold">{s.label}</div>
                      {s.sublabel && (
                        <div className="text-xs text-muted-foreground">{s.sublabel}</div>
                      )}
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {s.type.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setCurrencyOpen((v) => !v)
                setLangOpen(false)
                setNotifOpen(false)
              }}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-bold hover:bg-muted"
            >
              {currency} <ChevronDown className="size-3.5 opacity-60" />
            </button>
            {currencyOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[100px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-xl dark:bg-card">
                {currencies.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCurrency(c)
                      setCurrencyOpen(false)
                    }}
                    className={cn(
                      'block w-full px-4 py-2 text-left text-sm font-semibold hover:bg-muted',
                      c === currency && 'bg-muted text-teal',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setLangOpen((v) => !v)
                setCurrencyOpen(false)
                setNotifOpen(false)
              }}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-bold hover:bg-muted"
              aria-label="Dil"
            >
              <Globe className="size-4" />
              {locales.find((l) => l.code === locale)?.label}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[80px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-xl dark:bg-card">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLocale(l.code)
                      setLangOpen(false)
                    }}
                    className={cn(
                      'block w-full px-4 py-2 text-left text-sm font-semibold hover:bg-muted',
                      l.code === locale && 'bg-muted text-teal',
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v)
                setCurrencyOpen(false)
                setLangOpen(false)
              }}
              className="relative rounded-lg p-2 hover:bg-muted"
              aria-label="Bildirimler"
            >
              <Bell className="size-5" />
              {demoNotifications.some((n) => !n.read) && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-teal ring-2 ring-white" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-white shadow-xl dark:bg-card">
                <div className="border-b border-border px-4 py-3 text-sm font-bold">
                  Bildirimler
                </div>
                {demoNotifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href || '#'}
                    onClick={() => setNotifOpen(false)}
                    className={cn(
                      'block border-b border-border/50 px-4 py-3 last:border-0 hover:bg-muted/50',
                      !n.read && 'bg-teal/5',
                    )}
                  >
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{n.body}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">{n.time}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={isB2B ? '/b2b' : '/account'}
            className="hidden rounded-lg p-2 hover:bg-muted sm:inline-flex"
            aria-label="Profil"
          >
            <User className="size-5" />
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative rounded-lg p-2 hover:bg-muted"
            aria-label="Teklif sepeti"
          >
            <ClipboardList className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-white lg:hidden dark:bg-card"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => switchMode('b2c')}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-sm font-bold',
                    !isB2B ? 'bg-medical text-white' : 'bg-muted',
                  )}
                >
                  B2C
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('b2b')}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-sm font-bold',
                    isB2B ? 'bg-teal text-white' : 'bg-muted',
                  )}
                >
                  B2B
                </button>
              </div>
              {!isB2B && (
                <div className="mb-3 max-h-64 overflow-y-auto rounded-xl border border-border">
                  <CategoryMegaMenu mobile onNavigate={() => setMobileOpen(false)} />
                </div>
              )}
              {isB2B && (
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Katalog
                </Link>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
