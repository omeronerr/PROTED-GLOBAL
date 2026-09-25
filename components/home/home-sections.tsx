'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Award,
  Factory,
  FlaskConical,
  Globe2,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react'
import { FadeIn, HorizontalReveal, RevealText, Stagger, StaggerItem } from '@/components/motion'
import { ProductCard } from '@/components/products/product-card'
import { MENU_GROUPS, categories, getCategory, products } from '@/lib/data'

const pillars = [
  {
    icon: FlaskConical,
    title: 'Quality',
    text: 'Kalite tesadüf değil; yılların deneyimi ve sürekli iyileştirme sürecinin sonucudur.',
  },
  {
    icon: Globe2,
    title: 'Network',
    text: '63 ülke ve 5 kıtaya ihracat — nitelikli global dağıtım ağı.',
  },
  {
    icon: Factory,
    title: 'Production',
    text: 'Ankara fabrikasında protez-ortez ve atölye makineleri üretimi.',
  },
  {
    icon: HeartHandshake,
    title: 'Support',
    text: 'Müşteri ilişkilerine özen; taleplere hızlı ve uzman yanıt.',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'ISO 13485 Certified' },
  { icon: Award, label: 'CE Marked' },
  { icon: Globe2, label: '63+ Country Network' },
  { icon: Factory, label: 'Ankara Manufacturing' },
]

/** Six clinical domains from PROTED brief */
const solutionDomains = [
  {
    id: 'lower',
    title: 'Alt Ekstremite',
    titleEn: 'Lower Extremity',
    body: 'Mikroişlemcili, hidrolik, pnömatik ve polisentrik diz eklemleri; karbon ve protez ayaklar.',
    href: '/products?category=hydraulic-knee-joints',
    image:
      categories.find((c) => c.id === 'hydraulic-knee-joints')?.image ||
      '/products/troya-hydraulic-monocentric-knee-joint.jpg',
  },
  {
    id: 'adapters',
    title: 'Adaptörler & Yapı',
    titleEn: 'Adapters & Structure',
    body: 'Pyramid adaptörler, tüp kelepçeleri, hizalama ve bağlantı bileşenleri.',
    href: '/products?category=adapters-and-structural-components',
    image:
      categories.find((c) => c.id === 'adapters-and-structural-components')?.image ||
      categories.find((c) => c.id === 'adapter-tubes')?.image ||
      '/placeholder.svg',
  },
  {
    id: 'socket',
    title: 'Soket & Süspansiyon',
    titleEn: 'Socket & Suspension',
    body: 'Aktif vakum, silikon liner/sleeve, pin lock ve kozmetik köpük sistemleri.',
    href: '/products?category=silicone-liners',
    image:
      categories.find((c) => c.id === 'silicone-liners')?.image ||
      '/products/flexcomfort-locking-cushion-liner.png',
  },
  {
    id: 'upper',
    title: 'Üst Ekstremite',
    titleEn: 'Upper Extremity',
    body: 'Miyoelektrik ve mekanik protez eller, terminal cihazlar ve askı sistemleri.',
    href: '/products?category=myoelectric-hand',
    image:
      categories.find((c) => c.id === 'myoelectric-hand')?.image ||
      categories.find((c) => c.id === 'prosthetic-hands')?.image ||
      '/placeholder.svg',
  },
  {
    id: 'orthotics',
    title: 'Ortez Sistemleri',
    titleEn: 'Orthotics',
    body: 'Ortez diz eklemleri, stance control, AFO ve omurga destek çözümleri.',
    href: '/products?category=orthotics',
    image:
      categories.find((c) => c.id === 'orthotics')?.image ||
      categories.find((c) => c.id === 'orthotics-knee-joints')?.image ||
      '/placeholder.svg',
  },
  {
    id: 'kids',
    title: 'Pediatrik',
    titleEn: 'Pediatric',
    body: 'Hafif çocuk protez ayakları, diz/kalça ve bağlantı bileşenleri.',
    href: '/products?category=kids-prosthetic-foot',
    image:
      categories.find((c) => c.id === 'kids-prosthetic-foot')?.image ||
      '/placeholder.svg',
  },
]

export function HomeSections() {
  const featured = products.filter((p) => p.featured).slice(0, 4)
  const rangeCats = categories.filter((c) => (c.count ?? 0) > 0).slice(0, 9)

  return (
    <>
      {/* Trust strip — post-hero, not overlay */}
      <section className="border-b border-border bg-white dark:bg-card">
        <Stagger className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-5 py-6 lg:px-10">
          {trustBadges.map((b) => (
            <StaggerItem
              key={b.label}
              className="flex items-center gap-2.5 text-xs font-semibold tracking-wide text-muted-foreground"
            >
              <b.icon className="size-4 text-teal" />
              {b.label}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-b border-border bg-white dark:bg-card">
        <Stagger className="mx-auto grid max-w-[1440px] sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <StaggerItem
              key={p.title}
              className="flex items-start gap-4 border-b border-border px-7 py-12 sm:border-r sm:border-b-0 last:border-r-0 lg:px-9"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-teal">
                <p.icon className="size-5" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-wide">{p.title}</div>
                <div className="mt-2 text-xs leading-5 text-muted-foreground">{p.text}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Six clinical solution domains */}
      <section className="mx-auto max-w-[1440px] section-pad">
        <FadeIn className="max-w-3xl">
          <div className="eyebrow">Clinical solutions</div>
          <RevealText
            text="Altı uzmanlık alanında mühendislik"
            as="h2"
            className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl"
            delay={0.05}
          />
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            Alt ekstremiteden pediatriye — PROTED üretim alanları klinik ihtiyaca göre
            yapılandırılmıştır.
          </p>
        </FadeIn>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {solutionDomains.map((d, i) => (
            <StaggerItem key={d.id}>
              <Link
                href={d.href}
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white transition duration-700 hover:border-teal/35 hover:shadow-[0_28px_80px_-40px_rgba(10,25,47,0.45)] dark:bg-card"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-surface via-white to-teal/5">
                  <Image
                    src={d.image}
                    alt={d.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-8 transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 font-display text-4xl font-bold text-medical/8 dark:text-white/10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col border-t border-border p-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {d.titleEn}
                  </div>
                  <div className="mt-1.5 font-display text-xl font-bold">{d.title}</div>
                  <p className="mt-2 flex-1 text-xs leading-5 text-muted-foreground">{d.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal">
                    Keşfet <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Product ranges — category tiles */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-[1440px] section-pad">
          <FadeIn className="max-w-3xl">
            <div className="eyebrow">Product ranges</div>
            <RevealText
              text="Klinik ihtiyaçlara göre sınıflandırılmış teknoloji"
              as="h2"
              className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl"
              delay={0.05}
            />
          </FadeIn>

          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {rangeCats.map((c) => (
              <StaggerItem key={c.id}>
                <Link
                  href={`/products?category=${c.id}`}
                  className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl border border-border bg-white transition duration-700 hover:border-teal/40 dark:bg-card"
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-surface via-white to-teal/5">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-6 transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative mt-auto border-t border-border p-6">
                    <div className="font-display text-lg font-bold tracking-tight">
                      {c.nameTr}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {c.descriptionTr}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal">
                      İncele{' '}
                      <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn className="mt-10 flex flex-wrap gap-3" delay={0.1}>
            {MENU_GROUPS.map((g) => {
              const first = g.categoryIds.map(getCategory).find(Boolean)
              return (
                <Link
                  key={g.id}
                  href={first ? `/products?category=${first.id}` : '/products'}
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-teal hover:text-teal dark:bg-card"
                >
                  {g.titleTr}
                </Link>
              )
            })}
          </FadeIn>
        </div>
      </section>

      <section className="bg-white py-24 dark:bg-background lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <FadeIn className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">Exclusive products</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Öne çıkan teknolojiler
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:underline"
            >
              Tüm katalog <ArrowRight className="size-4" />
            </Link>
          </FadeIn>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {featured.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden bg-medical text-medical-foreground">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
        <HorizontalReveal className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-24 lg:grid-cols-[1.2fr_auto] lg:px-10 lg:py-32">
          <div>
            <div className="eyebrow !text-teal">Since 1992</div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-5xl">
              Engineering prosthetic & orthotic solutions
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
              Profesyonel çözümler, güçlü ortaklıklar — ürün, teklif, sipariş ve kargo
              süreçlerini tek panelde yönetin.
            </p>
          </div>
          <Link
            href="/b2b"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-medical transition hover:bg-teal hover:text-white"
          >
            Kurumsal portal <ArrowRight className="size-4" />
          </Link>
        </HorizontalReveal>
      </section>

      <section className="mx-auto max-w-[1440px] section-pad">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">Global footprint</div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Dünya çapında güven
          </h2>
        </FadeIn>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { stat: '63+', label: 'Ülke ihracat ağı' },
            { stat: '1992', label: 'Kuruluş — Ankara' },
            { stat: 'ISO', label: '13485 & 9001' },
          ].map((s) => (
            <StaggerItem
              key={s.label}
              className="rounded-3xl border border-border bg-white px-8 py-16 text-center dark:bg-card"
            >
              <div className="font-display text-5xl font-bold text-teal md:text-6xl">
                {s.stat}
              </div>
              <div className="mt-3 text-sm font-semibold text-muted-foreground">{s.label}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  )
}
