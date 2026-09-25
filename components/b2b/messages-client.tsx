'use client'

import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { demoTickets } from '@/lib/data'
import { cn } from '@/lib/utils'

export function MessagesClient() {
  const [activeId, setActiveId] = useState(demoTickets[0]?.id)
  const [message, setMessage] = useState('')
  const [thread, setThread] = useState<Record<string, string[]>>({
    t1: [
      'Merhaba, PR04.HD.K04 hidrolik direnç ayarını netleştirmek istiyoruz.',
      'Teknik dokümantasyon eklendi, ek sorularınız için yanıt bekliyoruz.',
    ],
    t2: [
      'Toplu SKU import için Excel şablonu rica ederiz.',
      'Şablon e-posta ile iletildi.',
    ],
  })

  const active = demoTickets.find((t) => t.id === activeId)

  const send = () => {
    if (!message.trim() || !activeId) return
    setThread((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), message.trim()],
    }))
    setMessage('')
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Kurumsal mesajlaşma
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Destek & satış kanalı
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          PROTED temsilcileriyle doğrudan portal içi ticket
        </p>
      </div>

      <div className="mt-8 grid min-h-[480px] overflow-hidden rounded-2xl border border-border bg-white lg:grid-cols-[320px_1fr] dark:bg-card">
        <aside className="border-b border-border lg:border-b-0 lg:border-r">
          {demoTickets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={cn(
                'w-full border-b border-border/60 px-4 py-4 text-left transition hover:bg-muted/50',
                activeId === t.id && 'bg-surface',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{t.subject}</span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                    t.status === 'open' && 'bg-teal/15 text-teal',
                    t.status === 'pending' && 'bg-amber-500/15 text-amber-700',
                    t.status === 'resolved' && 'bg-muted text-muted-foreground',
                  )}
                >
                  {t.status}
                </span>
              </div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {t.lastMessage}
              </div>
            </button>
          ))}
        </aside>

        <div className="flex flex-col">
          {active ? (
            <>
              <div className="border-b border-border px-5 py-4">
                <div className="font-display text-lg font-bold">{active.subject}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {active.assignee} · Öncelik: {active.priority}
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                {(thread[active.id] || []).map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      i % 2 === 0
                        ? 'ml-auto bg-medical text-white'
                        : 'bg-muted',
                    )}
                  >
                    {m}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-border p-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Mesaj yazın…"
                  className="h-11 flex-1 rounded-xl border border-border bg-muted/30 px-3 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
                />
                <button
                  type="button"
                  onClick={send}
                  className="flex size-11 items-center justify-center rounded-xl bg-teal text-white"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="size-10 opacity-30" />
              <p className="mt-3 text-sm">Ticket seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
