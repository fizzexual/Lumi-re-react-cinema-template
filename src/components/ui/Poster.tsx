import { useState } from 'react'
import type { Film } from '../../data/types'
import { PosterArt } from './PosterArt'
import { cn } from '../../lib/cn'

/**
 * Portrait poster. Renders the real TMDB poster over the procedural art, which
 * shows through while loading or if the image ever fails (no broken images).
 */
export function Poster({
  film,
  className,
}: {
  film: Film
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const showImg = !!film.posterUrl && !failed
  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-ink-850', className)}>
      <PosterArt film={film} withText={!showImg} />
      {showImg && (
        <img
          src={film.posterUrl}
          alt={`${film.title} poster`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}

/**
 * Landscape backdrop image with the same graceful fallback. Caller supplies its
 * own overlays/scrims on top.
 */
export function Backdrop({
  film,
  className,
}: {
  film: Film
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const showImg = !!film.backdropUrl && !failed
  return (
    <div
      className={cn('grain absolute inset-0 overflow-hidden', className)}
      style={{ background: `linear-gradient(135deg, ${film.palette[0]}, #06060a)` }}
    >
      {showImg && (
        <img
          src={film.backdropUrl}
          alt=""
          aria-hidden
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}
