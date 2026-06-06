import type { ReactNode } from 'react'
import { Aperture, Volume2, Sparkles, Armchair, Film, Clapperboard } from 'lucide-react'
import type { Format } from '../../data/types'
import { cn } from '../../lib/cn'

/* ----------------------------------------------------------------------------
 * Format "logos" — stylised premium-experience badges (IMAX, Dolby Atmos, …)
 * -------------------------------------------------------------------------- */

const FORMAT_META: Record<
  Format,
  { icon: typeof Aperture; className: string }
> = {
  IMAX: { icon: Aperture, className: 'tracking-[0.18em]' },
  'Dolby Atmos': { icon: Volume2, className: 'tracking-[0.12em]' },
  '4DX': { icon: Sparkles, className: 'tracking-[0.16em]' },
  Premium: { icon: Armchair, className: 'tracking-[0.12em]' },
  '35mm': { icon: Film, className: 'tracking-[0.12em]' },
  Standard: { icon: Clapperboard, className: 'tracking-[0.1em]' },
}

export function FormatLogo({
  format,
  size = 'md',
  className,
}: {
  format: Format
  size?: 'sm' | 'md'
  className?: string
}) {
  const meta = FORMAT_META[format]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] font-bold uppercase text-white',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        meta.className,
        className,
      )}
    >
      <Icon className={cn('text-gold-300', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {format}
    </span>
  )
}

/* ----------------------------------------------------------------------------
 * Studio / partner wordmarks — monochrome, varied weights to read as logos
 * -------------------------------------------------------------------------- */

const STUDIOS: { label: string; className: string }[] = [
  { label: 'WARNER BROS.', className: 'font-serif tracking-tight' },
  { label: 'UNIVERSAL', className: 'tracking-[0.3em] font-light' },
  { label: 'PARAMOUNT', className: 'tracking-[0.25em]' },
  { label: 'A24', className: 'font-black text-base ring-1 ring-white/40 rounded px-1.5' },
  { label: 'LIONSGATE', className: 'tracking-[0.2em] font-semibold' },
  { label: 'FOCUS FEATURES', className: 'tracking-[0.15em] font-light' },
  { label: 'NEON', className: 'font-black tracking-tight' },
  { label: 'SEARCHLIGHT', className: 'tracking-[0.2em] font-medium' },
]

const PARTNERS: { label: string; node?: boolean }[] = [
  { label: 'IMAX' },
  { label: 'DOLBY ATMOS' },
  { label: '4DX' },
  { label: 'DTS:X' },
]

function DolbyMark() {
  return (
    <svg viewBox="0 0 40 24" className="h-4 w-7" aria-hidden>
      <path
        d="M2 2 h12 a10 10 0 0 1 0 20 H2 Z M38 22 H26 a10 10 0 0 1 0 -20 H38 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function LogoMarquee() {
  const items = [
    ...STUDIOS.map((s) => ({ kind: 'studio' as const, ...s })),
    ...PARTNERS.map((p) => ({ kind: 'partner' as const, ...p })),
  ]
  const loop = [...items, ...items]

  return (
    <div className="mask-fade-x relative overflow-hidden py-2">
      <div className="flex w-max animate-marquee items-center gap-14">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 text-neutral-500 transition-colors hover:text-white"
            title={item.label}
          >
            {item.label === 'DOLBY ATMOS' && <DolbyMark />}
            <span
              className={cn(
                'whitespace-nowrap text-sm font-semibold uppercase',
                'className' in item ? (item as { className?: string }).className : '',
              )}
            >
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Payment method logos (checkout)
 * -------------------------------------------------------------------------- */

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center justify-center rounded-md bg-white px-2 text-[11px] font-bold',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function PaymentLogos({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Pill className="italic text-[#1434CB]">VISA</Pill>
      <Pill className="gap-0.5">
        <span className="h-3.5 w-3.5 rounded-full bg-[#EB001B]" />
        <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[#F79E1B]/90" />
      </Pill>
      <Pill className="text-[#006FCF]">AMEX</Pill>
      <Pill className="text-ink-950"> Pay</Pill>
      <Pill className="text-[#003087]">
        Pay<span className="text-[#0070E0]">Pal</span>
      </Pill>
    </div>
  )
}
