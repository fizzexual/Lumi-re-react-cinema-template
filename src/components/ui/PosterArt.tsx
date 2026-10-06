import type { Film } from '../../data/types'
import { posterBackground, sheen } from '../../lib/posterArt'
import { cn } from '../../lib/cn'

/**
 * Procedurally-composed poster. Looks art-directed, renders instantly, and
 * never 404s. Replace with <img src={film.posterUrl}/> when wiring real assets.
 */
export function PosterArt({
  film,
  withText = true,
  className,
}: {
  film: Film
  withText?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'grain relative h-full w-full overflow-hidden',
        className,
      )}
      style={{ background: posterBackground(film) }}
    >
      {/* Concentric "projector lens" rings keyed to the film accent */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-50 blur-2xl"
        style={{ background: film.accent }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 100 150"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g fill="none" stroke="white" strokeWidth="0.4">
          <circle cx="50" cy="58" r="40" />
          <circle cx="50" cy="58" r="28" />
          <circle cx="50" cy="58" r="16" />
        </g>
        <line x1="0" y1="58" x2="100" y2="58" stroke="white" strokeWidth="0.3" opacity="0.5" />
        <line x1="50" y1="0" x2="50" y2="150" stroke="white" strokeWidth="0.3" opacity="0.5" />
      </svg>

      {/* Sheen sweep */}
      <div className="absolute inset-0" style={{ background: sheen() }} />

      {/* Bottom legibility scrim */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t/srgb from-ink-950 via-ink-950/70 to-transparent" />

      {withText && (
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            {film.genres.slice(0, 2).join(' · ')}
          </p>
          <h3 className="font-display text-xl font-extrabold leading-none text-white text-shadow-lg">
            {film.title}
          </h3>
        </div>
      )}
    </div>
  )
}
