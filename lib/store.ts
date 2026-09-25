'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  CartItem,
  CommerceMode,
  CurrencyCode,
  LocaleCode,
  Product,
  Quote,
  QuoteLine,
} from './types'
import { demoCompany, demoQuotes, demoUser } from './data'

interface AppState {
  mode: CommerceMode
  currency: CurrencyCode
  locale: LocaleCode
  cartOpen: boolean
  aiOpen: boolean
  searchOpen: boolean
  cart: CartItem[]
  quotes: Quote[]
  quoteDraft: QuoteLine[]
  isAuthenticated: boolean
  setMode: (mode: CommerceMode) => void
  setCurrency: (currency: CurrencyCode) => void
  setLocale: (locale: LocaleCode) => void
  setCartOpen: (open: boolean) => void
  setAiOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  addToCart: (product: Product, qty?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQty: (productId: string, quantity: number) => void
  clearCart: () => void
  login: () => void
  logout: () => void
  addToQuote: (product: Product, qty?: number) => void
  removeFromQuote: (productId: string) => void
  updateQuoteQty: (productId: string, quantity: number) => void
  clearQuoteDraft: () => void
  saveQuote: (notes?: string) => Quote
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'b2c',
      currency: 'EUR',
      locale: 'tr',
      cartOpen: false,
      aiOpen: false,
      searchOpen: false,
      cart: [],
      quotes: demoQuotes,
      quoteDraft: [],
      isAuthenticated: false,

      setMode: (mode) => set({ mode }),
      setCurrency: (currency) => set({ currency }),
      setLocale: (locale) => set({ locale }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setAiOpen: (aiOpen) => set({ aiOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),

      addToCart: (product, qty = 1) => {
        const { cart } = get()
        const existing = cart.find((i) => i.productId === product.id)
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i,
            ),
            cartOpen: true,
          })
        } else {
          set({
            cart: [
              ...cart,
              {
                productId: product.id,
                sku: product.sku,
                name: product.name,
                image: product.image,
                quantity: qty,
                stockStatus: product.stockStatus,
              },
            ],
            cartOpen: true,
          })
        }
      },

      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.productId !== productId) }),

      updateCartQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        set({
          cart: get().cart.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        })
      },

      clearCart: () => set({ cart: [] }),

      login: () => set({ isAuthenticated: true, mode: 'b2b' }),
      logout: () => set({ isAuthenticated: false, mode: 'b2c' }),

      addToQuote: (product, qty = 1) => {
        const existing = get().quoteDraft.find((l) => l.productId === product.id)
        if (existing) {
          set({
            quoteDraft: get().quoteDraft.map((l) =>
              l.productId === product.id
                ? { ...l, quantity: l.quantity + qty }
                : l,
            ),
          })
        } else {
          set({
            quoteDraft: [
              ...get().quoteDraft,
              {
                productId: product.id,
                sku: product.sku,
                name: product.name,
                quantity: qty,
              },
            ],
          })
        }
      },

      removeFromQuote: (productId) =>
        set({
          quoteDraft: get().quoteDraft.filter((l) => l.productId !== productId),
        }),

      updateQuoteQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromQuote(productId)
          return
        }
        set({
          quoteDraft: get().quoteDraft.map((l) =>
            l.productId === productId ? { ...l, quantity } : l,
          ),
        })
      },

      clearQuoteDraft: () => set({ quoteDraft: [] }),

      saveQuote: (notes = '') => {
        const draft = get().quoteDraft
        const quote: Quote = {
          id: `q-${Date.now()}`,
          number: `QT-2026-${String(get().quotes.length + 160).padStart(4, '0')}`,
          status: 'draft',
          companyId: demoCompany.id,
          createdBy: demoUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
          revision: 1,
          lines: draft,
          notes,
          currency: demoCompany.currency,
        }
        set({ quotes: [quote, ...get().quotes], quoteDraft: [] })
        return quote
      },
    }),
    {
      name: 'proted-commerce-v2',
      partialize: (s) => ({
        mode: s.mode,
        currency: s.currency,
        locale: s.locale,
        cart: s.cart,
        quotes: s.quotes,
        quoteDraft: s.quoteDraft,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
)

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}
