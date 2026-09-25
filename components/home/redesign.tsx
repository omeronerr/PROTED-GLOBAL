'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import styles from './redesign.module.css'

const highlights = {
  foot: {
    image: '/products/sahra-carbon-foot.png',
    alt: 'Proted SAHRA karbon protez ayak',
    description: 'Her adımda daha fazla özgürlük için geliştirilen protez ve ortez çözümleri.',
    cta: "SAHRA'YI KEŞFET",
    href: '/products/sahra-carbon-foot',
  },
  hand: {
    image: '/products/2-channel-myoelectric-hand.png',
    alt: 'Proted iki kanallı miyolektrik protez el',
    description: 'İleri teknoloji, hayatın içindeki hareketlere yeni olanaklar kazandırır.',
    cta: 'MİYOELEKTRİK ELİ KEŞFET',
    href: '/products/2-channel-myoelectric-hand',
  },
} as const

const featuredProducts = [
  {
    category: 'PROTEZ AYAKLAR',
    title: <>ASYA<br />Karbon Ayak</>,
    description: 'Hafif, esnek ve güvenli yürüyüş için.',
    image: '/products/asya-carbon-foot.png',
    alt: 'Proted ASYA karbon ayak',
    href: '/products/asya-carbon-foot',
  },
  {
    category: 'DİZ EKLEMLERİ',
    title: <>TROYA<br />Hidrolik Diz</>,
    description: 'Aktif hareket için mekanik hassasiyet.',
    image: '/products/troya-hydraulic-monocentric-knee-joint.jpg',
    alt: 'Proted TROYA hidrolik diz eklemi',
    href: '/products/troya-hydraulic-monocentric-knee-joint',
  },
  {
    category: 'LİNER SİSTEMLERİ',
    title: <>FLEX<br />Comfort</>,
    description: 'Gün boyu konforu destekleyen tasarım.',
    image: '/products/flexcomfort-locking-cushion-liner.png',
    alt: 'Proted FlexComfort silikon liner',
    href: '/products/flexcomfort-locking-cushion-liner',
  },
] as const

const categories = [
  { title: 'Karbon Ayaklar', description: 'Dinamik ve hafif protez ayak seçenekleri', href: '/products?category=carbon-foot' },
  { title: 'Diz Eklemleri', description: 'Hidrolik diz eklemi sistemleri', href: '/products?category=hydraulic-knee-joints' },
  { title: 'Üst Ekstremite', description: 'Miyoelektrik protez el seçenekleri', href: '/products?category=myoelectric-hand' },
  { title: 'Ortezler', description: 'Ortez diz eklemi çözümleri', href: '/products?category=orthotics-knee-joints' },
] as const

function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <Link className={`${styles.pillLink} ${light ? styles.pillLight : ''}`} href={href}>{children}<span aria-hidden="true">↗</span></Link>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <span className={styles.sectionLabel}>{children}</span>
}

export function HomeRedesign() {
  const [active, setActive] = useState<'foot' | 'hand'>('foot')
  const selected = highlights[active]

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-hero-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <h1 className={styles.heroWord} id="home-hero-heading">HAREKET</h1>
        <Image
          className={`${styles.heroProduct} ${active === 'hand' ? styles.heroHand : ''}`}
          src={selected.image}
          alt={selected.alt}
          width={800}
          height={800}
          priority
        />
        <div className={`${styles.wrap} ${styles.heroInner}`}>
          <div className={styles.heroTopline}><span>PROTEZ &amp; ORTEZ TEKNOLOJİLERİ</span><span>01 / HAREKETİN ÖTESİNDE</span></div>
          <div className={styles.heroBottom}>
            <div className={styles.heroSwitch} aria-label="Öne çıkan ürün">
              <button type="button" aria-pressed={active === 'foot'} onClick={() => setActive('foot')}><span>01 /</span>KARBON AYAK</button>
              <button type="button" aria-pressed={active === 'hand'} onClick={() => setActive('hand')}><span>02 /</span>MİYOELEKTRİK EL</button>
            </div>
            <div className={styles.heroCopy}><p>{selected.description}</p><ArrowLink href={selected.href}>{selected.cta}</ArrowLink></div>
            <a className={styles.heroScroll} href="#intro"><span>AŞAĞI KAYDIR</span><i aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className={styles.statement} id="intro">
        <div className={`${styles.wrap} ${styles.statementGrid}`}><SectionLabel>PROTED YAKLAŞIMI</SectionLabel><h2>Hareket, yeni <em>olasılıkların</em> başlangıcıdır.</h2></div>
        <div className={`${styles.wrap} ${styles.statementBottom}`}><p>Proted, 1992’den bu yana protez ve ortez teknolojileri geliştiriyor. Ankara’daki üretim ve Ar-Ge altyapımızla insanların hareket özgürlüğünü destekleyen çözümler tasarlıyoruz.</p><ArrowLink href="/about" light>BİZİ TANIYIN</ArrowLink></div>
      </section>

      <section className={styles.ranges} id="urunler">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}><div><SectionLabel>ÜRÜN DÜNYASI</SectionLabel><h2>Hareket için<br />tasarlandı.</h2></div><p>Karbon ayaklardan diz eklemlerine, liner sistemlerinden üst ekstremite çözümlerine uzanan bir ürün yelpazesi.</p></div>
          <div className={styles.productGrid}>
            {featuredProducts.map((product, index) => <Link className={`${styles.productCard} ${index === 0 ? styles.productFeatured : ''}`} href={product.href} key={product.href}>
              <div className={styles.cardTop}><span>{product.category}</span><span>{String(index + 1).padStart(2, '0')} / 03</span></div>
              <Image src={product.image} alt={product.alt} width={700} height={700} sizes="(max-width: 760px) 100vw, 33vw" />
              <div className={styles.cardBottom}><div><h3>{product.title}</h3><small>{product.description}</small></div><span className={styles.roundArrow} aria-hidden="true">↗</span></div>
            </Link>)}
          </div>
          <Link className={styles.textLink} href="/products">TÜM ÜRÜNLERİ İNCELE <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className={styles.spotlight} id="yaklasim">
        <div className={styles.wrap}>
          <SectionLabel>ÜST EKSTREMİTE ÇÖZÜMLERİ</SectionLabel>
          <h2 className={styles.spotlightTitle}>TEKNOLOJİ<br /><span>HAREKETE</span><br />DÖNÜŞÜR.</h2>
          <div className={styles.spotlightBody}>
            <div className={styles.spotlightHalo} aria-hidden="true" />
            <Image className={styles.spotlightVisual} src="/products/2-channel-myoelectric-hand.png" alt="Proted iki kanallı miyolektrik protez el" width={800} height={800} sizes="(max-width: 760px) 100vw, 60vw" />
            <div className={styles.spotlightSpec}><div><strong>PROTED</strong><span>Üst ekstremite</span></div><div><strong>ÇÖZÜM</strong><span>Miyolektrik el</span></div></div>
            <div className={styles.spotlightCopy}><p>İleri mühendislik ve özenli üretim, günlük yaşamın her hareketinde anlam kazanır.</p><ArrowLink href="/products/2-channel-myoelectric-hand">ÜRÜNÜ KEŞFET</ArrowLink></div>
          </div>
        </div>
      </section>

      <section className={styles.about} id="kurumsal">
        <div className={styles.wrap}>
          <div className={styles.aboutHead}><SectionLabel>PROTED HAKKINDA</SectionLabel><h2>Üretimden<br /><span>geleceğe.</span></h2></div>
          <div className={styles.aboutMain}>
            <div className={styles.factoryImage}><Image src="/slider/slide-1.png" alt="Ankara'daki Proted Park üretim tesisi" width={1900} height={500} sizes="(max-width: 760px) 100vw, 50vw" /><span>PROTED PARK / ANKARA</span></div>
            <div className={styles.aboutCopy}><p>Fikirden ürüne uzanan sürecin her adımında mühendislik, üretim ve insan odağı bir arada.</p><div><p className={styles.aboutSmall}>Ankara İvedik OSB’deki entegre üretim tesisimizde protez ve ortez teknolojileri geliştiriyoruz. Proted, 2017’den beri resmî Ar-Ge Merkezi olarak çalışmalarını sürdürüyor.</p><Link className={styles.textLink} href="/about">HAKKIMIZDA <span aria-hidden="true">↗</span></Link></div></div>
          </div>
          <div className={styles.stats}><div><strong>1992</strong><span>PROTED'İN KURULUŞ YILI</span></div><div><strong>63</strong><span>İHRACAT YAPILAN ÜLKE</span></div><div><strong>2017</strong><span>RESMÎ AR-GE MERKEZİ</span></div></div>
        </div>
      </section>

      <section className={styles.explore}>
        <div className={styles.wrap}>
          <div className={styles.exploreHeading}><div><SectionLabel>DAHA FAZLASINI KEŞFEDİN</SectionLabel><h2>Her ihtiyaca<br />bir çözüm.</h2></div><span>ÜRÜN KATEGORİLERİ / 04</span></div>
          <div className={styles.categoryList}>{categories.map((category, index) => <Link href={category.href} className={styles.categoryRow} key={category.href}><span className={styles.categoryNumber}>{String(index + 1).padStart(2, '0')}</span><h3>{category.title}</h3><p>{category.description}</p><span className={styles.roundArrow} aria-hidden="true">↗</span></Link>)}</div>
        </div>
      </section>

      <section className={styles.contact}>
        <div className={styles.wrap}>
          <div className={styles.contactTop}><SectionLabel>İLETİŞİM</SectionLabel><span>ANKARA, TÜRKİYE ↗ DÜNYA</span></div>
          <h2>BİRLİKTE<br /><span>HAREKET.</span></h2>
          <div className={styles.contactBottom}><p>Ürünlerimiz, iş ortaklığı veya ihtiyaçlarınıza uygun çözümler hakkında konuşalım.</p><ArrowLink href="/support" light>BİZE ULAŞIN</ArrowLink></div>
        </div>
      </section>
    </div>
  )
}

