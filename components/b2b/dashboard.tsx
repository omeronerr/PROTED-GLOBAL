'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Package,
  RefreshCw,
  Upload,
  Users,
} from 'lucide-react'
import {
  demoCompany,
  demoOrders,
  demoQuotes,
  demoTickets,
  demoUser,
} from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'
import { cn } from '@/lib/utils'

const roleLabels = {
  company_admin: 'Şirket Yöneticisi',
  purchaser: 'Satın Alma',
  clinician: 'Klinik / Hekim',
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-500/15 text-blue-700',
  revised: 'bg-amber-500/15 text-amber-700',
  approved: 'bg-teal/15 text-teal',
  converted: 'bg-medical/15 text-medical',
  rejected: 'bg-destructive/15 text-destructive',
  shipped: 'bg-teal/15 text-teal',
  processing: 'bg-amber-500/15 text-amber-700',
  delivered: 'bg-medical/15 text-medical',
}

export function B2BDashboard() {
  const { quoteDraft, login, isAuthenticated } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated) login()
  }, [isAuthenticated, login])

  return (
    <div className="bg-surface/50 min-h-[80vh]">
      <div className="border-b border-border bg-medical text-medical-foreground">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden px-5 py-12 lg:px-10 lg:py-16">
          <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
          <FadeIn>
            <div className="eyebrow !text-teal">Kurumsal Bayi · Klinik Paneli</div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
              Hoş geldiniz, {demoUser.name.split(' ').slice(-1)}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              {demoCompany.name} · Cari {demoCompany.taxId} ·{' '}
              {roleLabels[demoUser.role]} · Anlaşmalı fiyatlar yalnızca bu oturumda
              görünür
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { href: '/b2b/quotes', label: 'Yeni teklif' },
                { href: '/products', label: 'Kataloğa git' },
                { href: '/b2b/messages', label: 'PROTED ile yazış' },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:border-teal hover:bg-teal"
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] space-y-8 px-5 py-10 lg:px-10">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Açık teklifler',
              value: String(demoQuotes.filter((q) => q.status !== 'converted').length),
              icon: FileText,
              href: '/b2b/quotes',
            },
            {
              label: 'Aktif siparişler',
              value: String(
                demoOrders.filter((o) =>
                  ['processing', 'shipped', 'confirmed'].includes(o.status),
                ).length,
              ),
              icon: Package,
              href: '/b2b/orders',
            },
            {
              label: 'Teklif taslağı',
              value: String(quoteDraft.length),
              icon: RefreshCw,
              href: '/b2b/quotes',
            },
            {
              label: 'Açık destek',
              value: String(demoTickets.filter((t) => t.status === 'open').length),
              icon: MessageSquare,
              href: '/b2b/messages',
            },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <Link
                href={s.href}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-teal/40 hover:shadow-lg dark:bg-card"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-surface text-teal">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs font-semibold text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <FadeIn className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Kurumsal anlaşma</h2>
              <span className="rounded-full bg-teal/15 px-2.5 py-1 text-[10px] font-bold text-teal">
                Gizli fiyat
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Liste fiyatı gösterilmez · anlaşmalı iskonto dilimleri ·{' '}
              {demoCompany.currency}
            </p>
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-semibold">Hacim dilimi</th>
                  <th className="pb-2 font-semibold">İskonto</th>
                </tr>
              </thead>
              <tbody>
                {demoCompany.volumeTiers.map((t) => (
                  <tr key={t.minQty} className="border-b border-border/60">
                    <td className="py-3">
                      {t.minQty}
                      {t.maxQty ? `–${t.maxQty}` : '+'} adet
                    </td>
                    <td className="py-3 font-bold text-teal">%{t.discountPercent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 rounded-xl bg-surface px-4 py-3 text-xs">
              Resmi fiyatlar teklif PDF&apos;inde iletilir. Ücretsiz kargo eşiği
              anlaşmanıza göre uygulanır.
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
            <h2 className="font-display text-lg font-bold">ERP entegrasyon</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Checkout hazırlık göstergeleri
            </p>
            <ul className="mt-5 space-y-3">
              {(
                [
                  ['SAP', demoCompany.erpReady.sap],
                  ['Logo', demoCompany.erpReady.logo],
                  ['Mikro', demoCompany.erpReady.mikro],
                ] as const
              ).map(([name, ready]) => (
                <li
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                >
                  <span className="text-sm font-bold">{name}</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-bold',
                      ready ? 'text-teal' : 'text-muted-foreground',
                    )}
                  >
                    {ready ? (
                      <>
                        <CheckCircle2 className="size-3.5" /> Hazır
                      </>
                    ) : (
                      'Beklemede'
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Son teklifler</h2>
              <Link href="/b2b/quotes" className="text-xs font-bold text-teal">
                Tümü
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {demoQuotes.slice(0, 3).map((q) => (
                <li
                  key={q.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-bold">{q.number}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Rev {q.revision} · {q.lines.length} kalem
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
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Hızlı işlemler</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/b2b/quotes"
                className="flex items-center gap-3 rounded-xl bg-medical px-4 py-4 text-sm font-bold text-white hover:bg-teal"
              >
                <FileText className="size-5" /> Teklif hazırla
              </Link>
              <Link
                href="/b2b/orders"
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-4 text-sm font-bold hover:border-teal"
              >
                <Upload className="size-5 text-teal" /> Excel/CSV import
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-4 text-sm font-bold hover:border-teal"
              >
                <Package className="size-5 text-teal" /> Katalog
              </Link>
              <Link
                href="/b2b/messages"
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-4 text-sm font-bold hover:border-teal"
              >
                <Users className="size-5 text-teal" /> Destek kanalı
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
