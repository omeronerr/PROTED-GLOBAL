import type {
  B2BCompany,
  B2BUser,
  CategoryInfo,
  NotificationItem,
  Order,
  Product,
  Quote,
  SupportTicket,
} from './types'
import productsJson from '@/data/proted-products.json'
import categoriesJson from '@/data/proted-categories.json'

/** Canonical category names — never trust scraped button text */
export const CATEGORY_NAME_MAP: Record<string, { en: string; tr: string }> = {
  'carbon-foot': { en: 'Carbon Foot', tr: 'Karbon Ayak' },
  'prosthetic-foot': { en: 'Prosthetic Foot', tr: 'Protez Ayak' },
  'hydraulic-knee-joints': { en: 'Hydraulic Knee Joints', tr: 'Hidrolik Diz Eklemleri' },
  'pneumatic-knee-joints': { en: 'Pneumatic Knee Joints', tr: 'Pnömatik Diz Eklemleri' },
  'polycentric-knee-joint': { en: 'Polycentric Knee Joint', tr: 'Polisentrik Diz Eklemi' },
  'polycentric-disarticulation-knee-joint': {
    en: 'Polycentric Disarticulation Knee',
    tr: 'Polisentrik Dezartikülasyon Diz',
  },
  'monocentric-knee-joint': { en: 'Monocentric Knee Joint', tr: 'Monosenrik Diz Eklemi' },
  'microprocessor-knee-joint': {
    en: 'Microprocessor Knee Joint',
    tr: 'Mikroişlemcili Diz Eklemi',
  },
  'knee-joints': { en: 'Knee Joints', tr: 'Diz Eklemleri' },
  'hip-joints': { en: 'Hip Joints', tr: 'Kalça Eklemleri' },
  'silicone-liners': { en: 'Silicone Liners', tr: 'Silikon Linerlar' },
  'silicone-sleeve': { en: 'Silicone Sleeve', tr: 'Silikon Kolluk' },
  'pin-lock-systems': { en: 'Pin Lock Systems', tr: 'Pin Lock Sistemleri' },
  'active-vacuum-system': { en: 'Active Vacuum System', tr: 'Aktif Vakum Sistemi' },
  'adapter-tubes': { en: 'Adapter Tubes', tr: 'Adaptör Tüpler' },
  'adapters-and-structural-components': {
    en: 'Adapters & Structural Components',
    tr: 'Adaptörler & Yapısal Bileşenler',
  },
  'cosmetic-foams': { en: 'Cosmetic Foams', tr: 'Kozmetik Köpükler' },
  'socket-systems': { en: 'Socket Systems', tr: 'Soket Sistemleri' },
  'myoelectric-hand': { en: 'Myoelectric Hand', tr: 'Miyoelektrik El' },
  'prosthetic-hands': { en: 'Prosthetic Hands', tr: 'Protez Eller' },
  'cosmetic-gloves': { en: 'Cosmetic Gloves', tr: 'Kozmetik Eldivenler' },
  'elbow-shoulder-joints': { en: 'Elbow & Shoulder Joints', tr: 'Dirsek & Omuz Eklemleri' },
  'upper-extremity-parts': { en: 'Upper Extremity Parts', tr: 'Üst Ekstremite Parçaları' },
  'upper-extremity-prosthetics': {
    en: 'Upper Extremity Prosthetics',
    tr: 'Üst Ekstremite Protezleri',
  },
  'harness-systems': { en: 'Harness Systems', tr: 'Askı Sistemleri' },
  orthotics: { en: 'Orthotics', tr: 'Ortezler' },
  'orthotics-knee-joints': { en: 'Orthotics Knee Joints', tr: 'Ortez Diz Eklemleri' },
  'orthotics-ankle-joint': { en: 'Orthotics Ankle Joint', tr: 'Ortez Ayak Bileği' },
  'orthotics-hip-joint': { en: 'Orthotics Hip Joint', tr: 'Ortez Kalça Eklemi' },
  'lateral-bars': { en: 'Lateral Bars', tr: 'Lateral Barlar' },
  'kids-prosthetic-foot': { en: 'Kids Prosthetic Foot', tr: 'Çocuk Protez Ayak' },
  'kids-knee-joints': { en: 'Kids Knee & Hip Joints', tr: 'Çocuk Diz & Kalça' },
  'kids-connection-adapters': {
    en: 'Kids Connection Adapters',
    tr: 'Çocuk Bağlantı Adaptörleri',
  },
  'kids-adapter-tubes': { en: 'Kids Adapter Tubes', tr: 'Çocuk Adaptör Tüpler' },
  'kids-tube-adapters': { en: 'Kids Tube Adapters', tr: 'Çocuk Tüp Adaptörleri' },
  'kids-socket-adapters': { en: 'Kids Socket Adapters', tr: 'Çocuk Soket Adaptörleri' },
  'kids-pin-lock-system': { en: 'Kids Pin Lock System', tr: 'Çocuk Pin Lock' },
  'kids-cosmetic-foam': { en: 'Kids Cosmetic Foam', tr: 'Çocuk Kozmetik Köpük' },
  'tools-and-equipments': { en: 'Tools & Equipments', tr: 'Araçlar & Ekipmanlar' },
}

function resolveCategoryName(id: string, fallback?: string) {
  const mapped = CATEGORY_NAME_MAP[id]
  if (mapped) return mapped
  if (fallback && !/add to cart/i.test(fallback)) {
    return { en: fallback, tr: fallback }
  }
  const human = id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return { en: human, tr: human }
}

export const products: Product[] = (productsJson as Array<Record<string, unknown>>).map(
  (raw) => {
    const categorySlug = String(raw.categorySlug || raw.category || '')
    return {
      id: String(raw.id),
      slug: String(raw.slug || raw.id),
      sku: String(raw.sku || raw.id),
      name: String(raw.name || ''),
      nameTr: String(raw.nameTr || raw.name || ''),
      description: String(raw.description || ''),
      descriptionTr: String(raw.descriptionTr || raw.description || ''),
      longDescription: String(raw.longDescription || raw.description || ''),
      longDescriptionTr: String(
        raw.longDescriptionTr || raw.descriptionTr || raw.description || '',
      ),
      category: categorySlug,
      categorySlug,
      categoryName: resolveCategoryName(
        categorySlug,
        String(raw.categoryName || ''),
      ).tr,
      kLevels: (raw.kLevels as Product['kLevels']) || [],
      materials: (raw.materials as string[]) || [],
      applicationTypes: (raw.applicationTypes as string[]) || [],
      stockStatus: (raw.stockStatus as Product['stockStatus']) || 'in_stock',
      stockQty: Number(raw.stockQty ?? 10),
      image: String(raw.image || '/placeholder.svg'),
      gallery: (raw.gallery as string[]) || [String(raw.image || '/placeholder.svg')],
      specs: (raw.specs as Product['specs']) || [],
      features: (raw.features as Product['features']) || [],
      variants: (raw.variants as Product['variants']) || [],
      warranty: String(raw.warranty || '24 months limited warranty'),
      sourceUrl: String(raw.sourceUrl || ''),
      featured: Boolean(raw.featured),
      new: Boolean(raw.new),
      compatibleSkus: (raw.compatibleSkus as string[]) || [],
      tags: (raw.tags as string[]) || [],
    } satisfies Product
  },
)

function resolveCategoryImage(
  id: string,
  slug: string,
  raw?: string,
): string {
  // Prefer a real product photo — sharper than scraped category thumbs
  const fromProduct = products.find(
    (p) =>
      (p.category === id || p.categorySlug === id || p.categorySlug === slug) &&
      p.image &&
      !p.image.includes('placeholder'),
  )
  if (fromProduct?.image) return fromProduct.image
  if (raw && raw.trim() && !raw.includes('placeholder')) return raw
  return `/categories/${slug}.jpg`
}

export const categories: CategoryInfo[] = (categoriesJson as Array<{
  id: string
  slug: string
  name: string
  nameTr?: string
  description?: string
  descriptionTr?: string
  image?: string
  productCount?: number
  url?: string
}>).map((c) => {
  const names = resolveCategoryName(c.id, c.nameTr || c.name)
  return {
    id: c.id,
    slug: c.slug,
    name: names.en,
    nameTr: names.tr,
    description: c.description?.includes('Add to cart')
      ? `${names.en} — PROTED Global product range.`
      : c.description || `${names.en} — PROTED Global product range.`,
    descriptionTr: c.descriptionTr?.includes('Add to cart')
      ? `${names.tr} — PROTED Global ürün grubu.`
      : c.descriptionTr || `${names.tr} — PROTED Global ürün grubu.`,
    image: resolveCategoryImage(c.id, c.slug, c.image),
    count:
      c.productCount ??
      products.filter((p) => p.category === c.id || p.categorySlug === c.id).length,
  }
})

/** Flattened label map for filters / chips */
export const CATEGORY_LABELS: Record<string, { en: string; tr: string }> =
  Object.fromEntries(categories.map((c) => [c.id, { en: c.name, tr: c.nameTr }]))

/** Mega-menu groups — six clinical domains from PROTED brief */
export const MENU_GROUPS: {
  id: string
  title: string
  titleTr: string
  categoryIds: string[]
}[] = [
  {
    id: 'lower',
    title: 'Lower Extremity',
    titleTr: 'Alt Ekstremite',
    categoryIds: [
      'microprocessor-knee-joint',
      'hydraulic-knee-joints',
      'pneumatic-knee-joints',
      'polycentric-knee-joint',
      'polycentric-disarticulation-knee-joint',
      'monocentric-knee-joint',
      'knee-joints',
      'hip-joints',
      'carbon-foot',
      'prosthetic-foot',
    ],
  },
  {
    id: 'adapters',
    title: 'Adapters & Structure',
    titleTr: 'Adaptörler & Yapı',
    categoryIds: [
      'adapters-and-structural-components',
      'adapter-tubes',
    ],
  },
  {
    id: 'socket',
    title: 'Socket & Suspension',
    titleTr: 'Soket & Süspansiyon',
    categoryIds: [
      'active-vacuum-system',
      'silicone-liners',
      'silicone-sleeve',
      'pin-lock-systems',
      'cosmetic-foams',
      'socket-systems',
    ],
  },
  {
    id: 'upper',
    title: 'Upper Extremity',
    titleTr: 'Üst Ekstremite',
    categoryIds: [
      'myoelectric-hand',
      'prosthetic-hands',
      'cosmetic-gloves',
      'elbow-shoulder-joints',
      'upper-extremity-parts',
      'upper-extremity-prosthetics',
      'harness-systems',
    ],
  },
  {
    id: 'orthotics',
    title: 'Orthotics',
    titleTr: 'Ortezler',
    categoryIds: [
      'orthotics',
      'orthotics-knee-joints',
      'orthotics-ankle-joint',
      'orthotics-hip-joint',
      'lateral-bars',
    ],
  },
  {
    id: 'kids',
    title: 'Pediatric',
    titleTr: 'Pediatrik',
    categoryIds: [
      'kids-prosthetic-foot',
      'kids-knee-joints',
      'kids-connection-adapters',
      'kids-adapter-tubes',
      'kids-tube-adapters',
      'kids-socket-adapters',
      'kids-pin-lock-system',
      'kids-cosmetic-foam',
    ],
  },
  {
    id: 'workshop',
    title: 'Tools & Workshop',
    titleTr: 'Atölye & Ekipman',
    categoryIds: ['tools-and-equipments'],
  },
]

export function getCategory(idOrSlug: string) {
  return categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
}

export function getProductsByCategory(categoryId: string) {
  return products.filter(
    (p) =>
      p.category === categoryId ||
      (p as Product & { categorySlug?: string }).categorySlug === categoryId,
  )
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id || p.slug === id)
}

export function getProductBySku(sku: string) {
  return products.find((p) => p.sku?.toLowerCase() === sku.toLowerCase())
}

export function stockLabel(
  status: Product['stockStatus'] = 'in_stock',
  locale: 'tr' | 'en' = 'tr',
) {
  const map = {
    in_stock: { tr: 'Stokta', en: 'In Stock' },
    low_stock: { tr: 'Az Stok', en: 'Low Stock' },
    preorder: { tr: 'Ön Sipariş', en: 'Preorder' },
    out_of_stock: { tr: 'Tükendi', en: 'Out of Stock' },
  }
  return map[status || 'in_stock'][locale]
}

export const demoCompany: B2BCompany = {
  id: 'co-1',
  name: 'ABC Endüstri A.Ş.',
  taxId: 'A12345',
  country: 'TR',
  currency: 'EUR',
  negotiatedDiscountPercent: 12,
  volumeTiers: [
    { minQty: 1, maxQty: 4, discountPercent: 12 },
    { minQty: 5, maxQty: 19, discountPercent: 18 },
    { minQty: 20, maxQty: null, discountPercent: 25 },
  ],
  freeFreightThreshold: 10,
  erpReady: { sap: true, logo: true, mikro: false },
}

export const demoUser: B2BUser = {
  id: 'u-1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@abcendustri.com',
  role: 'company_admin',
  companyId: 'co-1',
  title: 'Yetkili · Endüstriyel Ürünler',
}

export const demoQuotes: Quote[] = [
  {
    id: 'q1',
    number: 'QT-2026-0142',
    status: 'sent',
    companyId: 'co-1',
    createdBy: 'u-1',
    createdAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-03-19T14:20:00Z',
    validUntil: '2026-04-18T23:59:59Z',
    revision: 2,
    currency: 'EUR',
    notes: 'Klinik stok yenileme',
    lines: products.slice(0, 2).map((p) => ({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      quantity: 4,
    })),
  },
]

export const demoOrders: Order[] = [
  {
    id: 'o1',
    number: 'ORD-2026-0891',
    status: 'shipped',
    companyId: 'co-1',
    createdAt: '2026-03-05T12:00:00Z',
    trackingNumber: 'TRK-88429103',
    carrier: 'DHL Express',
    items: products.slice(0, 2).map((p) => ({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      image: p.image,
      quantity: 2,
      stockStatus: p.stockStatus || 'in_stock',
    })),
  },
]

export const demoTickets: SupportTicket[] = [
  {
    id: 't1',
    subject: 'Teknik dokümantasyon talebi',
    status: 'open',
    priority: 'high',
    createdAt: '2026-03-20T09:15:00Z',
    lastMessage: 'Dokümantasyon hazırlanıyor.',
    assignee: 'Mehmet Kaya — Teknik Destek',
  },
]

export const demoNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Katalog güncellendi',
    body: `${products.length} ürün · ${categories.length} kategori protedglobal.com ile senkron.`,
    time: 'şimdi',
    read: false,
    href: '/products',
  },
]
