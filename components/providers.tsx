'use client'

import { useEffect, useState } from 'react'

/** Avoid SSR/client hydration mismatch for zustand persist. */
export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return <>{children}</>
}
