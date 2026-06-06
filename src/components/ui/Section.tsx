import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  // Full-bleed like a streaming UI: fill the frame width with a modest gutter,
  // no centred max-width cap (only a guard against absurd ultra-wide stretching).
  return (
    <div className={cn('w-full px-4 sm:px-8 lg:px-12 xl:px-[3.75vw] 2xl:px-16', className)}>
      {children}
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  action?: { label: string; to: string }
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-gold-200 hover:text-gold-100 sm:inline-flex"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
