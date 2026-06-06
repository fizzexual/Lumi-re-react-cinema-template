import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { Certificate } from '../../data/types'

export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  )
}

const certColors: Record<Certificate, string> = {
  U: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
  PG: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30',
  '12A': 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
  '15': 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30',
  '18': 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30',
}

export function CertBadge({ cert }: { cert: Certificate }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-bold',
        certColors[cert],
      )}
      title={`Certificate ${cert}`}
    >
      {cert}
    </span>
  )
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-gold-300/60 bg-gold-300/15 text-gold-200'
          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
