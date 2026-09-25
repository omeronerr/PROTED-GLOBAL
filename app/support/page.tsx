import type { Metadata } from 'next'
import { FadeIn } from '@/components/motion'

export const metadata: Metadata = { title: 'Destek' }

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-10">
      <FadeIn>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Destek merkezi
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
          Teknik dokümanlar & iletişim
        </h1>
        <div className="mt-8 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            <strong className="text-foreground">Telefon:</strong> +90 312 394 7575
          </p>
          <p>
            <strong className="text-foreground">E-posta:</strong> proted@proted.com.tr
          </p>
          <p>
            <strong className="text-foreground">Adres:</strong> Melih Gökçek Bulvarı,
            İvedik OSB, No:151/37, PROTED PARK, Yenimahalle / Ankara
          </p>
          <p>
            B2B hesaplarınız için portal içi mesajlaşma kanalını kullanın. ISO 13485
            belgelerine ve ürün PDF&apos;lerine ürün sayfalarından erişebilirsiniz.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
