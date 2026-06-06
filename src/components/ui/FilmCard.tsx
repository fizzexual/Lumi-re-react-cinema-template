import { Link } from 'react-router-dom'
import { Play, Plus, Clock } from 'lucide-react'
import type { Film } from '../../data/types'
import { ScoreChip } from './Rating'
import { CertBadge } from './Badge'
import { Backdrop } from './Poster'
import { runtimeLabel } from '../../lib/format'
import { cn } from '../../lib/cn'

/**
 * Landscape (16:9) thumbnail card — Netflix-style. Uses the real TMDB backdrop
 * with a graceful gradient fallback; title + actions overlay on top.
 */
export function FilmCard({
  film,
  className,
}: {
  film: Film
  className?: string
}) {
  return (
    <Link
      to={`/film/${film.slug}`}
      className={cn(
        'group/card relative block w-full overflow-hidden rounded-md bg-ink-850 shadow-card transition-all duration-300 hover:z-20 hover:scale-[1.06] hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Backdrop film={film} />

        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/10" />

        {/* top meta */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          <ScoreChip score={film.score} size="sm" />
          <CertBadge cert={film.certificate} />
        </div>

        {film.trending && film.status === 'now-showing' && (
          <span className="absolute right-2.5 top-9 rounded-sm bg-crimson-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            Trending
          </span>
        )}

        {/* title (hidden on hover so the action panel's title doesn't double up) */}
        <div className="absolute inset-x-0 bottom-0 p-3 transition-opacity duration-200 group-hover/card:opacity-0">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
            {film.genres.slice(0, 2).join(' · ')}
          </p>
          <h3 className="font-display text-xl font-extrabold leading-tight text-white text-shadow-lg">
            {film.title}
          </h3>
        </div>

        {/* hover action bar */}
        <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black via-black/85 to-transparent px-3 pb-3 pt-10 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <div className="mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
              {film.genres.slice(0, 2).join(' · ')}
            </p>
            <h3 className="font-display text-xl font-extrabold leading-tight text-white">
              {film.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink-950 transition-transform group-hover/card:scale-105">
              <Play className="h-4 w-4 fill-ink-950" />
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/40 bg-black/40 text-white">
              <Plus className="h-4 w-4" />
            </span>
            <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-white/80">
              <Clock className="h-3 w-3" />
              {runtimeLabel(film.runtime)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
