'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { FilePlus2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { products } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function MiniCart() {
  const { cartOpen, setCartOpen, cart, updateCartQty, removeFromCart } =
    useAppStore()

  const recommendations = products
    .filter((p) => !cart.some((c) => c.productId === p.id) && p.featured)
    .slice(0, 2)

  const totalUnits = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-medical/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="font-display text-lg font-bold">Teklif sepeti</div>
                <div className="text-xs text-muted-foreground">
                  {cart.length} ürün · {totalUnits} adet · fiyat teklifle
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Kapat"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length > 0 && (
                <div className="mb-4 rounded-xl border border-teal/25 bg-teal/5 px-3 py-2.5 text-[11px] leading-5 text-muted-foreground">
                  <strong className="text-teal">Uyumluluk:</strong> Adaptör ve tüp
                  çapı eşleşmelerini sipariş öncesi PROTED AI veya teknik destek ile
                  doğrulayın.
                </div>
              )}

              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="size-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm font-semibold">Sepetiniz boş</p>
                  <Link
                    href="/products"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 rounded-xl bg-medical px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Kataloğa git
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.productId} className="flex gap-3">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">{item.name}</div>
                        <div className="text-[11px] text-muted-foreground">{item.sku}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-border">
                            <button
                              type="button"
                              className="p-1.5 hover:bg-muted"
                              onClick={() =>
                                updateCartQty(item.productId, item.quantity - 1)
                              }
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-1.5 hover:bg-muted"
                              onClick={() =>
                                updateCartQty(item.productId, item.quantity + 1)
                              }
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <div
                          className={cn(
                            'mt-1 text-[10px] font-semibold',
                            item.stockStatus === 'in_stock' && 'text-teal',
                            item.stockStatus === 'low_stock' && 'text-amber-600',
                            item.stockStatus === 'out_of_stock' && 'text-destructive',
                          )}
                        >
                          {item.stockStatus === 'in_stock' && '✓ Stokta'}
                          {item.stockStatus === 'low_stock' && '⚠ Düşük stok'}
                          {item.stockStatus === 'out_of_stock' && '✕ Stok yok'}
                          {item.stockStatus === 'preorder' && '○ Ön sipariş'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {recommendations.length > 0 && cart.length > 0 && (
                <div className="mt-8">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tamamlayıcı öneriler
                  </div>
                  <div className="mt-3 space-y-2">
                    {recommendations.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.id}`}
                        onClick={() => setCartOpen(false)}
                        className="flex items-center gap-3 rounded-xl border border-border p-2.5 transition hover:border-teal/40"
                      >
                        <div className="relative size-12 overflow-hidden rounded-lg bg-muted">
                          <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-bold">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">{p.sku}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border px-5 py-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Ürün fiyatları klinik anlaşmaya göre belirlenir. Sepetinizi
                  teklife dönüştürün.
                </p>
                <Link
                  href="/b2b/quotes"
                  onClick={() => setCartOpen(false)}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-medical text-sm font-bold text-white transition hover:bg-teal"
                >
                  <FilePlus2 className="size-4" /> Teklife dönüştür
                </Link>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="mt-2 w-full py-2 text-center text-xs font-semibold text-muted-foreground"
                >
                  Alışverişe devam
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
