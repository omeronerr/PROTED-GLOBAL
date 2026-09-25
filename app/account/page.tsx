'use client'

import Link from 'next/link'
import { demoCompany, demoUser } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export default function AccountPage() {
  const { isAuthenticated, login, logout, mode } = useAppStore()

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-display text-3xl font-bold">Hesap</h1>
      {isAuthenticated ? (
        <div className="mt-8 rounded-2xl border border-border bg-white p-6 dark:bg-card">
          <div className="text-sm font-bold">{demoUser.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{demoUser.email}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {demoCompany.name} · Mod: {mode.toUpperCase()}
          </div>
          <div className="mt-6 flex gap-2">
            <Link
              href="/b2b"
              className="rounded-xl bg-medical px-4 py-2.5 text-sm font-bold text-white"
            >
              B2B Panel
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
            >
              Çıkış
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-white p-6 dark:bg-card">
          <p className="text-sm text-muted-foreground">
            Kurumsal portal için giriş yapın (demo).
          </p>
          <button
            type="button"
            onClick={login}
            className="mt-5 h-11 w-full rounded-xl bg-medical text-sm font-bold text-white"
          >
            B2B Giriş
          </button>
        </div>
      )}
    </div>
  )
}
