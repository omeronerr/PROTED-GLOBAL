import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { MENU_GROUPS, getCategory, products, categories } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border bg-medical text-medical-foreground">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-[1.1fr_2fr] lg:px-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal text-lg font-black text-white">
              P
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-tight">PROTED</div>
              <div className="text-[9px] font-semibold tracking-[0.32em] text-white/50">
                GLOBAL
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            Profesyonel çözümler, güçlü ortaklıklar.
            <br />
            {products.length} ürün · {categories.filter((c) => (c.count ?? 0) > 0).length}{' '}
            kategori · B2B müşteri portalı.
          </p>
          <div className="mt-6 space-y-2.5 text-sm text-white/70">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal" />
              <span>İvedik OSB, PROTED PARK, Yenimahalle / Ankara</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-teal" />
              <span>+90 312 394 7575</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-teal" />
              <span>proted@proted.com.tr</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_GROUPS.slice(0, 3).map((g) => (
            <div key={g.id}>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
                {g.titleTr}
              </div>
              <ul className="mt-4 space-y-2">
                {g.categoryIds.slice(0, 6).map((id) => {
                  const c = getCategory(id)
                  if (!c || !(c.count ?? 0)) return null
                  return (
                    <li key={id}>
                      <Link
                        href={`/products?category=${id}`}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {c.nameTr}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-5 py-5 text-xs text-white/45 sm:flex-row lg:px-10">
          <span>© 2026 PROTED Global. Kaynak: protedglobal.com</span>
          <div className="flex gap-5">
            <Link href="/support" className="hover:text-white">
              Gizlilik
            </Link>
            <Link href="/products" className="hover:text-white">
              Katalog
            </Link>
            <Link href="/b2b" className="hover:text-white">
              B2B
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
