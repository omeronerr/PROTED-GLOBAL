import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'

export const metadata: Metadata = { title: 'Hakkımızda' }

export default function AboutPage() {
  return (
    <div>
      <section className="mesh-bg border-b border-border">
        <FadeIn className="mx-auto max-w-4xl px-5 py-20 lg:px-10">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-teal">
            PROTED Global
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Engineering prosthetic & orthotic solutions since 1992
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-foreground">
            PROTED, engelli bireylerin ihtiyaçlarını karşılamak ve yaşam kalitesini
            artırmak için en yüksek kalitede protez ve ortez ürünleri üretmeyi
            vizyon edinir. Ankara İvedik OSB&apos;deki entegre üretim tesisinde CNC,
            karbon kompozit, silikon işleme, hassas döküm ve dijital üretim
            altyapısıyla çalışır.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-10">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold">Ar-Ge & kalite</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            2017&apos;den beri T.C. Sanayi ve Teknoloji Bakanlığı onaylı Ar-Ge
            Merkezi olarak yüksek teknoloji protez-ortez projelerine odaklanır.
            ISO 13485 ve ISO 9001 kalite yönetim sistemleri; ürünler CE işaretli
            olup EC Uygunluk Beyanı&apos;ndaki standartlara uygundur.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { t: '63+', d: 'Ülke ihracat ağı' },
            { t: '5', d: 'Kıtada dağıtım' },
            { t: '1992', d: 'Kuruluş yılı' },
          ].map((x) => (
            <StaggerItem
              key={x.d}
              className="rounded-2xl border border-border bg-white px-6 py-8 text-center dark:bg-card"
            >
              <div className="font-display text-3xl font-bold text-teal">{x.t}</div>
              <div className="mt-2 text-xs font-semibold text-muted-foreground">
                {x.d}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn className="mt-12">
          <h2 className="font-display text-2xl font-bold">Üretim yetkinlikleri</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
            <li>· In-house engineering & CNC machining</li>
            <li>· Composite carbon production</li>
            <li>· Silicone processing</li>
            <li>· Investment casting & digital manufacturing</li>
            <li>· Clinical application support units</li>
          </ul>
        </FadeIn>

        <Link
          href="/products"
          className="mt-10 inline-flex h-11 items-center rounded-xl bg-medical px-5 text-sm font-bold text-white"
        >
          Ürün gamını incele
        </Link>
      </section>
    </div>
  )
}
