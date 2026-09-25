export type CommerceMode = 'b2c' | 'b2b'

export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP'

export type LocaleCode = 'tr' | 'en' | 'es' | 'de' | 'fr'

export type StockStatus = 'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock'

export type KLevel = 'K1' | 'K2' | 'K3' | 'K4'

export type ProductCategory = string

export type B2BRole = 'company_admin' | 'purchaser' | 'clinician'

export type QuoteStatus = 'draft' | 'sent' | 'revised' | 'approved' | 'converted' | 'rejected'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductVariant {
  code: string
  label: string
  meta?: string
}

export interface ProductFeature {
  title: string
  titleTr: string
  description: string
  descriptionTr: string
}

export interface PricingTier {
  minQty: number
  maxQty: number | null
  discountPercent: number
}

export interface Product {
  id: string
  slug: string
  sku: string
  medicalCode?: string
  name: string
  nameTr: string
  description: string
  descriptionTr: string
  longDescription: string
  longDescriptionTr: string
  category: ProductCategory
  categorySlug?: string
  categoryName?: string
  kLevels: KLevel[]
  materials: string[]
  applicationTypes: string[]
  stockStatus: StockStatus
  stockQty: number
  image: string
  gallery: string[]
  specs: ProductSpec[]
  features: ProductFeature[]
  variants: ProductVariant[]
  warranty: string
  sourceUrl: string
  pdfUrl?: string
  featured?: boolean
  new?: boolean
  compatibleSkus?: string[]
  tags: string[]
}

export interface CategoryInfo {
  id: string
  slug: string
  name: string
  nameTr: string
  description: string
  descriptionTr: string
  image: string
  count?: number
}

export interface CartItem {
  productId: string
  sku: string
  name: string
  image: string
  quantity: number
  stockStatus: StockStatus
}

export interface B2BCompany {
  id: string
  name: string
  taxId: string
  country: string
  currency: CurrencyCode
  negotiatedDiscountPercent: number
  volumeTiers: PricingTier[]
  freeFreightThreshold: number
  erpReady: {
    sap: boolean
    logo: boolean
    mikro: boolean
  }
}

export interface B2BUser {
  id: string
  name: string
  email: string
  role: B2BRole
  companyId: string
  title: string
  avatar?: string
}

export interface QuoteLine {
  productId: string
  sku: string
  name: string
  quantity: number
  notes?: string
}

export interface Quote {
  id: string
  number: string
  status: QuoteStatus
  companyId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  validUntil: string
  revision: number
  lines: QuoteLine[]
  notes: string
  currency: CurrencyCode
}

export interface Order {
  id: string
  number: string
  status: OrderStatus
  companyId?: string
  createdAt: string
  items: CartItem[]
  trackingNumber?: string
  carrier?: string
}

export interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastMessage: string
  assignee: string
}

export interface SearchSuggestion {
  type: 'product' | 'sku' | 'category' | 'medical_code'
  label: string
  sublabel?: string
  href: string
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  href?: string
}
