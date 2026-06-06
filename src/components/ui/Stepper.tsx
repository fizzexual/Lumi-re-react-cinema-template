import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

const STEPS = ['Seats', 'Checkout', 'Confirmation']

/** Three-step booking progress indicator. `current` is 1-based. */
export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition-colors',
                  done && 'bg-gold-400 text-ink-950',
                  active && 'bg-white text-ink-950 ring-4 ring-gold-300/30',
                  !done && !active && 'bg-white/[0.06] text-slate-400',
                )}
              >
                {done ? <Check className="h-4 w-4" /> : step}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-semibold sm:block',
                  active ? 'text-white' : done ? 'text-gold-200' : 'text-slate-500',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  'h-px w-8 sm:w-16',
                  done ? 'bg-gold-400/60' : 'bg-white/10',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
