import { useEffect, useMemo, useRef, useState } from 'react'
import { Accessibility, Wand2, Minus, Plus, Eye } from 'lucide-react'
import type { RowTier, SelectedSeat } from '../../store/useBookingStore'
import { ROW_TIER_MULTIPLIER } from '../../store/useBookingStore'
import { useLocale } from '../../hooks/useLocale'
import { cn } from '../../lib/cn'

/** Auditorium layout: row letter → number of seats. Trapezoid for realism. */
const LAYOUT: { row: string; seats: number }[] = [
  { row: 'A', seats: 12 },
  { row: 'B', seats: 12 },
  { row: 'C', seats: 14 },
  { row: 'D', seats: 14 },
  { row: 'E', seats: 16 },
  { row: 'F', seats: 16 },
  { row: 'G', seats: 16 },
  { row: 'H', seats: 16 },
  { row: 'J', seats: 14 },
  { row: 'K', seats: 12 },
]

const PREMIUM_ROWS = new Set(['F', 'G', 'H'])
const WHEELCHAIR = new Set(['K1', 'K2', 'K11', 'K12'])
/** Rows nearest the "sweet spot", used to rank auto-pick suggestions. */
const SWEET_SPOT = ['G', 'F', 'H', 'E', 'J', 'D', 'C', 'K', 'B', 'A']
const ARC = 14 // px curve depth per row

export function rowTierFor(row: string): RowTier {
  return PREMIUM_ROWS.has(row) ? 'premium' : 'standard'
}

function allSeatIds(): string[] {
  return LAYOUT.flatMap(({ row, seats }) =>
    Array.from({ length: seats }, (_, i) => `${row}${i + 1}`),
  )
}

/** Deterministic pre-sold seats from the showtime seed + sold fraction. */
function initialTaken(seed: string, soldFraction: number): Set<string> {
  const ids = allSeatIds()
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const rnd = () => {
    h += 0x6d2b79f5
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const shuffled = [...ids].sort(() => rnd() - 0.5)
  const count = Math.floor(ids.length * soldFraction * 0.82)
  return new Set(shuffled.slice(0, count))
}

const TOTAL_SEATS = allSeatIds().length

export function SeatMap({
  seed,
  soldFraction,
  basePrice,
  selected,
  onToggle,
  onAutoSelect,
}: {
  seed: string
  soldFraction: number
  basePrice: number
  selected: SelectedSeat[]
  onToggle: (seat: Omit<SelectedSeat, 'ticket'>) => void
  onAutoSelect: (seats: Omit<SelectedSeat, 'ticket'>[]) => void
}) {
  const { money } = useLocale()
  const [taken, setTaken] = useState<Set<string>>(() => initialTaken(seed, soldFraction))
  const [justTaken, setJustTaken] = useState<string | null>(null)
  const [hovered, setHovered] = useState<{ id: string; tier: RowTier } | null>(null)
  const [party, setParty] = useState(2)

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected])
  const selectedRef = useRef(selectedIds)
  selectedRef.current = selectedIds

  // Simulate live booking activity from other customers.
  useEffect(() => {
    const id = setInterval(() => {
      setTaken((prev) => {
        const free = allSeatIds().filter(
          (sid) => !prev.has(sid) && !selectedRef.current.has(sid),
        )
        if (free.length <= 6) return prev
        const pick = free[Math.floor(Math.random() * free.length)]
        setJustTaken(pick)
        const next = new Set(prev)
        next.add(pick)
        return next
      })
    }, 4500)
    return () => clearInterval(id)
  }, [])

  const seatsLeft = TOTAL_SEATS - taken.size - selectedIds.size
  const viewers = useMemo(() => 5 + (Math.abs(hashStr(seed)) % 18), [seed])

  const stdPrice = basePrice * ROW_TIER_MULTIPLIER.standard
  const premPrice = basePrice * ROW_TIER_MULTIPLIER.premium

  function bestAvailable() {
    const block = computeBest(taken, selectedIds, party)
    if (block.length) onAutoSelect(block)
  }

  return (
    <div className="select-none">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-emerald-400" />
            {seatsLeft} seats left
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-medium text-neutral-300">
            <Eye className="h-3.5 w-3.5" /> {viewers} people viewing
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/4 p-1">
            <button
              onClick={() => setParty((p) => Math.max(1, p - 1))}
              className="grid h-7 w-7 place-items-center rounded-full text-white hover:bg-white/10"
              aria-label="Fewer seats"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-white">
              {party} {party === 1 ? 'seat' : 'seats'}
            </span>
            <button
              onClick={() => setParty((p) => Math.min(8, p + 1))}
              className="grid h-7 w-7 place-items-center rounded-full text-white hover:bg-white/10"
              aria-label="More seats"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={bestAvailable}
            className="inline-flex items-center gap-1.5 rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-4 py-2 text-xs font-bold text-ink-950 shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <Wand2 className="h-3.5 w-3.5" /> Best available
          </button>
        </div>
      </div>

      {/* Curved screen */}
      <div className="mx-auto mb-12 w-full max-w-2xl">
        <svg viewBox="0 0 600 56" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M16 46 Q300 4 584 46"
            fill="none"
            stroke="url(#screenGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255,255,255,0.45))' }}
          />
        </svg>
        <p className="-mt-1 text-center text-[11px] font-semibold uppercase tracking-[0.5em] text-neutral-500">
          Screen
        </p>
      </div>

      {/* Seats (curved) */}
      <div className="flex flex-col items-center gap-[14px] perspective">
        {LAYOUT.map(({ row, seats }) => {
          const tier = rowTierFor(row)
          const mid = Math.floor(seats / 2)
          const half = (seats - 1) / 2
          return (
            <div key={row} className="flex items-center gap-2">
              <span className="w-4 text-center text-[11px] font-semibold text-neutral-500">{row}</span>
              <div className="flex gap-1.5">
                {Array.from({ length: seats }, (_, i) => {
                  const col = i + 1
                  const id = `${row}${col}`
                  const isTaken = taken.has(id)
                  const isSelected = selectedIds.has(id)
                  const isWheel = WHEELCHAIR.has(id)
                  // arc: centre seats sit lower (further from the screen)
                  const norm = half === 0 ? 0 : (i - half) / half
                  const dy = ARC * (1 - norm * norm)
                  return (
                    <button
                      key={id}
                      disabled={isTaken}
                      onClick={() => onToggle({ id, row, col, rowTier: tier })}
                      onMouseEnter={() => !isTaken && setHovered({ id, tier })}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => !isTaken && setHovered({ id, tier })}
                      style={{ transform: `translateY(${dy}px)` }}
                      className={cn(
                        'relative grid h-6 w-6 place-items-center rounded-t-lg rounded-b-xs border transition-colors sm:h-7 sm:w-7',
                        i === mid && 'ml-5',
                        isTaken
                          ? 'cursor-not-allowed border-transparent bg-ink-700/60'
                          : isSelected
                          ? 'border-crimson-400 bg-linear-to-b/srgb from-crimson-500 to-crimson-600 shadow-glow-crimson'
                          : isWheel
                          ? 'border-sky-400/40 bg-sky-500/15 hover:border-sky-300 hover:bg-sky-500/30'
                          : tier === 'premium'
                          ? 'border-violet-400/40 bg-violet-500/15 hover:border-violet-300 hover:bg-violet-500/30'
                          : 'border-white/15 bg-white/6 hover:border-gold-300/70 hover:bg-gold-300/20',
                        !isTaken && 'hover:z-10 hover:scale-110',
                        justTaken === id && 'animate-pulse-ring',
                      )}
                      aria-pressed={isSelected}
                      aria-label={`Seat ${id}${isWheel ? ' wheelchair space' : ''}${isTaken ? ' taken' : ''}`}
                    >
                      {isWheel && (
                        <Accessibility
                          className={cn('h-3.5 w-3.5', isSelected ? 'text-white' : 'text-sky-300')}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
              <span className="w-4 text-center text-[11px] font-semibold text-neutral-500">{row}</span>
            </div>
          )
        })}
      </div>

      {/* Hover info */}
      <div className="mt-8 flex h-6 items-center justify-center text-sm">
        {hovered ? (
          <span className="text-neutral-200">
            Seat <span className="font-bold text-white">{hovered.id}</span> ·{' '}
            {hovered.tier === 'premium' ? 'Premium recliner' : 'Standard'} ·{' '}
            <span className="font-semibold text-gold-200">
              {money(hovered.tier === 'premium' ? premPrice : stdPrice)}
            </span>
          </span>
        ) : (
          <span className="text-neutral-500">Hover a seat for details · centre seats face the screen</span>
        )}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-neutral-300">
        <LegendItem className="border-white/15 bg-white/6" label={`Standard · ${money(stdPrice)}`} />
        <LegendItem className="border-violet-400/40 bg-violet-500/20" label={`Premium · ${money(premPrice)}`} />
        <LegendItem className="border-sky-400/40 bg-sky-500/20" label="Accessible" icon />
        <LegendItem
          className="border-crimson-400 bg-linear-to-b/srgb from-crimson-500 to-crimson-600"
          label="Selected"
        />
        <LegendItem className="border-transparent bg-ink-700/60" label="Taken" />
      </div>
    </div>
  )
}

function LegendItem({
  className,
  label,
  icon,
}: {
  className: string
  label: string
  icon?: boolean
}) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn('grid h-5 w-5 place-items-center rounded-t-lg rounded-b-xs border', className)}>
        {icon && <Accessibility className="h-3 w-3 text-sky-300" />}
      </span>
      {label}
    </span>
  )
}

/** Find the best contiguous block of `count` available seats near the centre. */
function computeBest(
  taken: Set<string>,
  selected: Set<string>,
  count: number,
): Omit<SelectedSeat, 'ticket'>[] {
  for (const row of SWEET_SPOT) {
    const def = LAYOUT.find((l) => l.row === row)
    if (!def) continue
    const n = def.seats
    const center = (n + 1) / 2
    let best: { cols: number[]; dist: number } | null = null
    for (let start = 1; start + count - 1 <= n; start++) {
      const cols = Array.from({ length: count }, (_, k) => start + k)
      const ok = cols.every((c) => {
        const id = `${row}${c}`
        return !taken.has(id) && !selected.has(id)
      })
      if (!ok) continue
      const windowCenter = (cols[0] + cols[cols.length - 1]) / 2
      const dist = Math.abs(windowCenter - center)
      if (!best || dist < best.dist) best = { cols, dist }
    }
    if (best) {
      const tier = rowTierFor(row)
      return best.cols.map((c) => ({ id: `${row}${c}`, row, col: c, rowTier: tier }))
    }
  }
  return []
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}
