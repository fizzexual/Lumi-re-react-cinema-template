import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { compactNumber } from '../../lib/format'

/** Compact numeric score chip, e.g. ★ 8.7 */
export function ScoreChip({
  score,
  votes,
  size = 'md',
}: {
  score: number
  votes?: number
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-black/70 font-semibold text-white ring-1 ring-white/15 backdrop-blur',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      )}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {score.toFixed(1)}
      {votes !== undefined && (
        <span className="font-normal text-slate-400">· {compactNumber(votes)}</span>
      )}
    </span>
  )
}

/** Five-star visual rating from a 0–10 score. */
export function Stars({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  const outOfFive = score / 2
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${score.toFixed(1)} out of 10`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, outOfFive - i))
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-ink-600" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** Interactive star input for review submission. */
export function StarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => {
        const v = i + 1
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${v} out of 10`}
          >
            <Star
              className={cn(
                'h-5 w-5',
                v <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-ink-500 hover:text-amber-400/60',
              )}
            />
          </button>
        )
      })}
      <span className="ml-2 text-sm font-semibold text-white">{value}/10</span>
    </div>
  )
}
