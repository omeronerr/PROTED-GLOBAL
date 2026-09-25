import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FadeIn, RevealText, Stagger, StaggerItem } from '@/components/motion'
import { MENU_GROUPS, categories, getCategory, products } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Klinik Çözümler',
  description:
    'PROTED Global protez ve ortez çözümleri — alt/üst ekstremite, soket sistemleri, adaptörler, ortez ve pediatrik ürünler.',
}

type SolutionBlock = {
  id: string
  title: string
  titleEn: string
  summary: string
  highlights: string[]
  categoryIds: string[]
  href: string
}

const solutions: SolutionBlock[] = [
  {
    id: 'lower',
    title: 'Alt Ekstremite Protezleri',
    titleEn: 'Lower Extremity Prosthetics',
    summary:
      'Aktif yaşamdan günlük kullanıma kadar diz eklemleri, protez ayaklar ve karbon ayak plakaları.',
    highlights: [
      'Mikroişlemcili diz eklemleri',
      'Hidrolik ve pnömatik dizler',
      'Polisentrik & monosentrik dizler',
      'Protez ayak / karbon ayak',
      'Kalça dezartikülasyon eklemleri',
    ],
    categoryIds: [
      'microprocessor-knee-joint',
      'hydraulic-knee-joints',
      'pneumatic-knee-joints',
      'polycentric-knee-joint',
      'monocentric-knee-joint',
      'carbon-foot',
      'prosthetic-foot',
      'hip-joints',
    ],
    href: '/products?category=hydraulic-knee-joints',
  },
  {
    id: 'adapters',
    title: 'Adaptörler ve Yapısal Bileşenler',
    titleEn: 'Adapters & Structural Components',
    summary:
      'Pyramid adaptörler, tüp kelepçeleri, hizalama parçaları ve bağlantı sistemleri.',
    highlights: [
      'Bağlantı ve pyramid adaptörler',
      'Tüp kelepçeleri ve adaptör tüpler',
      'Hizalama ve yapısal bileşenler',
    ],
    categoryIds: ['adapters-and-structural-components', 'adapter-tubes'],
    href: '/products?category=adapters-and-structural-components',
  },
  {
    id: 'socket',
    title: 'Soket Sistemleri ve Süspansiyon',
    titleEn: 'Socket Systems & Suspension',
    summary:
      'Güvenli tutuş ve konfor için liner, sleeve, pin lock, aktif vakum ve kozmetik köpükler.',
    highlights: [
      'Aktif vakum sistemleri',
      'Silikon liner ve sleeve',
      'Pin lock sistemleri',
      'Kozmetik köpükler',
      'Soket sistemleri',
    ],
    categoryIds: [
      'active-vacuum-system',
      'silicone-liners',
      'silicone-sleeve',
      'pin-lock-systems',
      'cosmetic-foams',
      'socket-systems',
    ],
    href: '/products?category=silicone-liners',
  },
  {
    id: 'upper',
    title: 'Üst Ekstremite Protezleri',
    titleEn: 'Upper Extremity Prosthetics',
    summary:
      'Miyoelektrik ve mekanik protez eller, terminal cihazlar, dirsek/omuz ve askı sistemleri.',
    highlights: [
      'Miyoelektrik el sistemleri',
      'Mekanik protez eller',
      'Kozmetik eldivenler',
      'Dirsek & omuz eklemleri',
      'Askı (harness) sistemleri',
    ],
    categoryIds: [
      'myoelectric-hand',
      'prosthetic-hands',
      'cosmetic-gloves',
      'elbow-shoulder-joints',
      'upper-extremity-parts',
      'harness-systems',
    ],
    href: '/products?category=myoelectric-hand',
  },
  {
    id: 'orthotics',
    title: 'Ortez Sistemleri',
    titleEn: 'Orthotics',
    summary:
      'Ortez diz ve ayak bileği eklemleri, lateral barlar ve klinik ortez bileşenleri.',
    highlights: [
      'Ortez diz eklemleri',
      'Ortez ayak bileği (AFO) eklemleri',
      'Ortez kalça eklemleri',
      'Lateral barlar',
      'Stance control uyumlu çözümler',
    ],
    categoryIds: [
      'orthotics',
      'orthotics-knee-joints',
      'orthotics-ankle-joint',
      'orthotics-hip-joint',
      'lateral-bars',
    ],
    href: '/products?category=orthotics',
  },
  {
    id: 'kids',
    title: 'Pediatrik Protez ve Ortezler',
    titleEn: 'Pediatric Solutions',
    summary:
      'Çocuklara özel hafif protez ayaklar, diz/kalça eklemleri ve bağlantı bileşenleri.',
    highlights: [
      'Çocuk protez ayakları',
      'Çocuk diz & kalça eklemleri',
      'Bağlantı ve tüp adaptörleri',
      'Pediatrik pin lock & kozmetik köpük',
    ],
    categoryIds: [
      'kids-prosthetic-foot',
      'kids-knee-joints',
      'kids-connection-adapters',
      'kids-adapter-tubes',
      'kids-pin-lock-system',
      'kids-cosmetic-foam',
    ],
    href: '/products?category=kids-prosthetic-foot',
  },
]

function coverImage(categoryIds: string[]) {
  for (const id of categoryIds) {
    const cat = getCategory(id)
    if (cat?.image && !cat.image.includes('placeholder')) return cat.image
    const prod = products.find(
      (p) =>
        (p.category === id || p.categorySlug === id) &&
        p.image &&
        !p.image.includes('placeholder'),
    )
    if (prod) return prod.image
  }
  return '/placeholder.svg'
}

function productCount(categoryIds: string[]) {
  return products.filter(
    (p) => categoryIds.includes(p.category) || categoryIds.includes(p.categorySlug),
  ).length
}

export default function SolutionsPage() {
  const workshop = MENU_GROUPS.find((g) => g.id === 'workshop')

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border mesh-bg">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
        <FadeIn className="relative mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <div className="eyebrow">PROTED Global · Clinical Solutions</div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Protez ve ortez mühendisliği çözümleri
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Ankara üretiminden 63+ ülkeye — alt ekstremiteden pediatriye, klinik
            ihtiyaca göre sınıflandırılmış PROTED ürün aileleri.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-medical px-5 text-sm font-bold text-white transition hover:bg-teal"
            >
              Tüm katalog <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/b2b/quotes"
              className="inline-flex h-11 items-center rounded-xl border border-border bg-white/80 px-5 text-sm font-bold backdrop-blur dark:bg-card"
            >
              Klinik teklif al
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="border-b border-border bg-white dark:bg-card">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-3 px-5 py-5 text-xs font-semibold text-muted-foreground lg:px-10">
          {[
            'ISO 13485',
            'CE Marked',
            `${products.length} ürün`,
            `${categories.filter((c) => (c.count ?? 0) > 0).length} kategori`,
            'Ankara Manufacturing',
          ].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-teal" />
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <FadeIn className="max-w-2xl">
          <div className="eyebrow">Solution families</div>
          <RevealText
            text="Altı uzmanlık alanında üretim"
            as="h2"
            className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl"
          />
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Her çözüm grubu, protedglobal.com kataloğundaki gerçek ürün
            kategorilerine bağlanır.
          </p>
        </FadeIn>

        <div className="mt-14 space-y-8">
          {solutions.map((s, i) => {
            const img = coverImage(s.categoryIds)
            const count = productCount(s.categoryIds)
            const reverse = i % 2 === 1

            return (
              <FadeIn key={s.id} delay={i * 0.04}>
                <article
                  className={`grid overflow-hidden rounded-[1.75rem] border border-border bg-white dark:bg-card lg:grid-cols-2 ${
                    reverse ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative min-h-[260px] bg-gradient-to-br from-surface via-white to-teal/5 lg:min-h-[320px]">
                    <Image
                      src={img}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-10"
                    />
                    <span className="absolute left-6 top-6 font-display text-5xl font-bold text-medical/8 dark:text-white/10">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center border-t border-border p-8 lg:border-t-0 lg:border-l lg:p-10">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      {s.titleEn}
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {s.summary}
                    </p>
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {s.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {s.categoryIds
                        .map((id) => getCategory(id))
                        .filter((c) => c && (c.count ?? 0) > 0)
                        .slice(0, 5)
                        .map((c) => (
                          <Link
                            key={c!.id}
                            href={`/products?category=${c!.id}`}
                            className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-muted-foreground transition hover:border-teal hover:text-teal"
                          >
                            {c!.nameTr}
                          </Link>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-medical px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal"
                      >
                        Ürünleri gör <ArrowRight className="size-4" />
                      </Link>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {count} ürün bu grupta
                      </span>
                    </div>
                  </div>
                </article>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {workshop && (
        <section className="border-y border-border bg-surface/50">
          <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
            <FadeIn>
              <div className="eyebrow">Workshop</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                Atölye ve ekipman
              </h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Klinik ve üretim atölyeleri için araçlar ve ekipmanlar.
              </p>
            </FadeIn>
            <Stagger className="mt-8 flex flex-wrap gap-3">
              {workshop.categoryIds.map((id) => {
                const c = getCategory(id)
                if (!c) return null
                return (
                  <StaggerItem key={id}>
                    <Link
                      href={`/products?category=${c.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold transition hover:border-teal dark:bg-card"
                    >
                      {c.nameTr}
                      <ArrowRight className="size-3.5 text-teal" />
                    </Link>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </section>
      )}

      <section className="bg-medical text-medical-foreground">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 py-16 lg:flex-row lg:items-center lg:px-10 lg:py-20">
          <div>
            <div className="eyebrow !text-teal">Klinik destek</div>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
              Hastaya özel reçete için bileşen listesi oluşturun
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-white/65">
              B2B portalında teklif hazırlayın, PDF alın ve onaylanan teklifi
              siparişe dönüştürün.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/b2b"
              className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-bold text-medical transition hover:bg-teal hover:text-white"
            >
              Kurumsal portal
            </Link>
            <Link
              href="/support"
              className="inline-flex h-12 items-center rounded-xl border border-white/25 px-6 text-sm font-bold text-white transition hover:border-white/50"
            >
              Teknik destek
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
