'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { products } from '@/lib/data'
import { useAppStore } from '@/lib/store'

type Msg = { role: 'user' | 'assistant'; text: string; links?: { label: string; href: string }[] }

const seed: Msg[] = [
  {
    role: 'assistant',
    text: 'Merhaba, ben PROTED AI. Uyumlu yedek parça önerisi, klinik çapraz referans veya teknik spesifikasyon sorabilirsiniz.',
  },
]

function answer(query: string): Msg {
  const q = query.toLowerCase()
  const carbon = products.find((p) => p.sku === 'PR01.K5')
  const knee = products.find((p) => p.sku === 'PR04.HD.K04')
  const liner = products.find((p) => p.sku === 'PR30.FC')

  if (q.includes('uyumlu') || q.includes('compatible') || q.includes('yedek')) {
    return {
      role: 'assistant',
      text: 'ASYA Carbon Foot (PR01.K5) için önerilen uyumlu bileşenler: TROYA hidrolik diz (PR04.HD.K04) ve FlexComfort Locking Liner (PR30.FC). K3–K4 aktivite için optimal kombinasyon.',
      links: [
        { label: carbon?.name || 'ASYA Carbon Foot', href: `/products/${carbon?.id}` },
        { label: knee?.name || 'TROYA Hydraulic', href: `/products/${knee?.id}` },
        { label: liner?.name || 'FlexComfort Liner', href: `/products/${liner?.id}` },
      ],
    }
  }

  if (q.includes('k-level') || q.includes('k seviye') || q.includes('aktivite')) {
    return {
      role: 'assistant',
      text: 'K-Level: K1 için monosenrik kilitli diz; K2–K3 için pnömatik/polisentrik; K3–K4 için TROYA hidrolik + ASYA/LARA karbon ayak + AirFeed vakum önerilir.',
      links: [{ label: 'Katalogu aç', href: '/products' }],
    }
  }

  if (q.includes('pr04') || q.includes('troya') || q.includes('hidrolik') || q.includes('kod')) {
    return {
      role: 'assistant',
      text: 'PR04.HD.K04 TROYA Hydraulic Monocentric Knee — fitted 252.5 mm, fleksiyon 145°, maks. 100 kg, mobilite sınıfı 3. Detaylar ürün sayfasında.',
      links: [{ label: 'TROYA Detay', href: `/products/${knee?.id}` }],
    }
  }

  return {
    role: 'assistant',
    text: 'Sorgunuz alındı. Örnek sorular: “Asya Carbon ile uyumlu yedek parçalar?”, “K4 aktivite için diz önerisi”, “L5611 medikal kod”.',
    links: [{ label: 'Öne çıkan ürünler', href: '/products' }],
  }
}

export function AiAssistant() {
  const { aiOpen, setAiOpen } = useAppStore()
  const [messages, setMessages] = useState<Msg[]>(seed)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg: Msg = { role: 'user', text: input.trim() }
    const reply = answer(input)
    setMessages((m) => [...m, userMsg, reply])
    setInput('')
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-medical px-4 py-3 text-sm font-bold text-white shadow-xl shadow-medical/30"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="PROTED AI"
      >
        <Sparkles className="size-4 text-teal" />
        PROTED AI
      </motion.button>

      <AnimatePresence>
        {aiOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-medical/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 right-0 z-[70] flex h-[min(640px,100dvh)] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[400px] sm:rounded-3xl dark:bg-card"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="flex items-center justify-between border-b border-border bg-medical px-4 py-3.5 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-teal/20">
                    <Bot className="size-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">PROTED AI</div>
                    <div className="text-[10px] text-white/60">Klinik teknik asistan</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === 'user' ? 'ml-8 text-right' : 'mr-6 text-left'
                    }
                  >
                    <div
                      className={
                        m.role === 'user'
                          ? 'inline-block rounded-2xl rounded-br-md bg-medical px-3.5 py-2.5 text-sm text-white'
                          : 'inline-block rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm'
                      }
                    >
                      {m.text}
                    </div>
                    {m.links && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setAiOpen(false)}
                            className="rounded-full border border-teal/30 bg-teal/5 px-2.5 py-1 text-[11px] font-semibold text-teal hover:bg-teal/10"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Teknik soru sorun..."
                    className="h-11 flex-1 rounded-xl border border-border bg-muted/40 px-3 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
                  />
                  <button
                    type="button"
                    onClick={send}
                    className="flex size-11 items-center justify-center rounded-xl bg-teal text-white"
                    aria-label="Gönder"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
