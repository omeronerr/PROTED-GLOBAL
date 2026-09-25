export interface HeroSlide {
  id: string
  image: string
  eyebrow: string
  title: string
  titleTr: string
  subtitle: string
  subtitleTr: string
  href: string
  cta: string
}

/** Homepage slides sourced from protedglobal.com slider assets */
export const heroSlides: HeroSlide[] = [
  {
    id: 'factory',
    image: '/slider/slide-1.png',
    eyebrow: 'PROTED Park · 2024',
    title: 'We moved to our new factory',
    titleTr: 'Yeni fabrikamıza taşındık',
    subtitle:
      'Follow our new building and new technologies in 2024 products.',
    subtitleTr:
      'Yeni binamızı ve 2024 ürünlerindeki yeni teknolojileri keşfedin.',
    href: '/about',
    cta: 'Hakkımızda',
  },
  {
    id: 'solar',
    image: '/slider/slide-2.png',
    eyebrow: 'Sustainability',
    title: 'We get our energy from the sun',
    titleTr: 'Enerjimizi güneşten alıyoruz',
    subtitle:
      '80% of factory energy from solar — reducing our carbon footprint toward 2030.',
    subtitleTr:
      'Fabrika enerjisinin %80’i güneşten — 2030’a doğru karbon ayak izini azaltıyoruz.',
    href: '/about',
    cta: 'Sürdürülebilirlik',
  },
  {
    id: 'casting',
    image: '/slider/slide-3.png',
    eyebrow: 'Advanced Manufacturing',
    title: 'Investment Casting',
    titleTr: 'Hassas Döküm',
    subtitle:
      'High-quality capacity by melting 400,000 metal pieces daily.',
    subtitleTr:
      'Günde 400.000 metal parça eriterek yüksek kaliteli üretim kapasitesi.',
    href: '/solutions',
    cta: 'Üretim teknolojisi',
  },
  {
    id: 'evoknee',
    image: '/slider/slide-4.png',
    eyebrow: 'R&D · EvoKnee',
    title: 'Patient trials underway',
    titleTr: 'Hasta denemeleri başladı',
    subtitle:
      'Microprocessor hydraulic knee joint EvoKnee — developed in our R&D center.',
    subtitleTr:
      'Ar-Ge merkezimizde geliştirdiğimiz mikroişlemcili hidrolik diz: EvoKnee.',
    href: '/products?category=hydraulic-knee-joints',
    cta: 'Diz sistemleri',
  },
  {
    id: 'knees',
    image: '/slider/slide-5.png',
    eyebrow: 'Knee Technology',
    title: 'Hydraulic & Pneumatic Knees',
    titleTr: 'Hidrolik & Pnömatik Dizler',
    subtitle:
      'TEDRA hydraulic joints join our long-standing pneumatic knee lineup.',
    subtitleTr:
      'TEDRA hidrolik eklemler, yıllardır sunduğumuz pnömatik diz gamına katıldı.',
    href: '/products?category=knee-joints',
    cta: 'Ürünleri gör',
  },
  {
    id: 'feet',
    image: '/slider/slide-6.png',
    eyebrow: 'Since 2005',
    title: '660 different prosthetic feet',
    titleTr: '660 farklı protez ayak',
    subtitle:
      'Sizes and colors engineered for clinical variety and fit.',
    subtitleTr:
      'Klinik çeşitlilik ve uyum için boyut ve renk seçenekleri.',
    href: '/products?category=carbon-foot',
    cta: 'Karbon ayaklar',
  },
  {
    id: 'myohis',
    image: '/slider/slide-7.png',
    eyebrow: 'Upper Extremity',
    title: 'MYOHİS is ready for order',
    titleTr: 'MYOHİS siparişe hazır',
    subtitle:
      'Our myoelectric prosthetic hand — precision grip for daily life.',
    subtitleTr:
      'Miyoelektrik protez elimiz — günlük yaşam için hassas kavrama.',
    href: '/products/myo-2ch-hand',
    cta: 'Miyoelektrik el',
  },
]
