'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { heroSlides } from '@/lib/hero-slides'

const AUTO_MS = 6500
const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const overlayY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const fadeOut = useTransform(scrollYProgress, [0, 0.85], [1, 0.2])

  const slide = heroSlides[index]
  const count = heroSlides.length

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir)
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  const next = useCallback(() => go(index + 1, 1), [go, index])
  const prev = useCallback(() => go(index - 1, -1), [go, index])

  useEffect(() => {
    if (paused || reduce) return
    const t = window.setTimeout(next, AUTO_MS)
    return () => window.clearTimeout(t)
  }, [index, paused, next, reduce])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-medical"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="PROTED ana sayfa vitrini"
    >
      {/* Full-bleed slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          custom={direction}
          variants={{
            enter: (d: number) => ({
              opacity: 0,
              scale: reduce ? 1 : 1.06,
              x: reduce ? 0 : d > 0 ? '4%' : '-4%',
            }),
            center: { opacity: 1, scale: 1, x: 0 },
            exit: (d: number) => ({
              opacity: 0,
              scale: reduce ? 1 : 1.04,
              x: reduce ? 0 : d > 0 ? '-3%' : '3%',
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.15, ease }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Ethnocare-like cinematic veil — left-weighted for typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-medical/85 via-medical/45 to-medical/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-medical/55 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-medical/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div
        style={{ y: overlayY, opacity: fadeOut }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 pt-28 sm:justify-center sm:pb-24 lg:px-14 xl:px-20"
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-copy'}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.75, ease }}
              className="max-w-2xl"
            >
              <div className="font-display text-[11px] font-bold tracking-[0.35em] text-teal uppercase sm:text-xs">
                PROTED
              </div>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.22em] text-white/55 uppercase">
                {slide.eyebrow}
              </p>

              <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.08 }}
                  >
                    {slide.titleTr}
                  </motion.span>
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                {slide.subtitleTr}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.href}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-medical shadow-[0_20px_50px_-20px_rgba(0,180,216,0.55)] transition hover:bg-teal hover:text-white"
                >
                  {slide.cta}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/products"
                  className="rounded-xl border border-white/25 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white/85 backdrop-blur-md transition hover:border-white/50 hover:bg-white/10"
                >
                  Tüm katalog
                </Link>
                <Link
                  href="/b2b"
                  className="text-sm font-semibold text-white/55 underline-offset-4 transition hover:text-white hover:underline"
                >
                  B2B Portal
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-8 left-5 right-5 z-20 mx-auto flex max-w-[1440px] items-end justify-between gap-6 lg:left-14 lg:right-14 xl:left-20 xl:right-20">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest text-white/50">
            <span className="text-white">{String(index + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(count).padStart(2, '0')}</span>
          </div>

          {/* Progress segments */}
          <div className="flex max-w-md gap-1.5">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slayt ${i + 1}: ${s.titleTr}`}
                aria-current={i === index}
                onClick={() => go(i, i > index ? 1 : -1)}
                className="group relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/20"
              >
                <motion.span
                  key={`prog-${s.id}-${index === i ? index : 'x'}`}
                  className="absolute inset-y-0 left-0 bg-teal"
                  initial={{ width: i < index ? '100%' : '0%' }}
                  animate={{
                    width:
                      i < index
                        ? '100%'
                        : i === index
                          ? '100%'
                          : '0%',
                  }}
                  transition={
                    i === index && !paused && !reduce
                      ? { duration: AUTO_MS / 1000, ease: 'linear' }
                      : { duration: 0.35, ease }
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Önceki slayt"
            className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/15"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Sonraki slayt"
            className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/15"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-[10px] font-bold tracking-[0.35em] text-white/35 uppercase md:block"
        animate={{ opacity: [0.25, 0.7, 0.25], y: [0, 5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      >
        Scroll
      </motion.div>
    </section>
  )
}
