'use client'

import {
  motion,
  type HTMLMotionProps,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { type ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

export const easeOutExpo = [0.22, 1, 0.36, 1] as const

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 40,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1, delay, ease: easeOutExpo }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = 'h1',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <Tag className={cn('flex flex-wrap gap-x-[0.3em] gap-y-1', className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.045,
              ease: easeOutExpo,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Stagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 36 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: easeOutExpo },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      className={cn('relative inline-flex', className)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

export function ParallaxImage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.06])

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

export function HorizontalReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.1, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}
