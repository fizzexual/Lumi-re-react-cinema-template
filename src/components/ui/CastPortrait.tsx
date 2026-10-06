import { useState } from 'react'
import { castPhoto } from '../../data/castPhotos'
import { cn } from '../../lib/cn'

const GRADIENTS = [
  'from-rose-500/30 to-orange-400/20',
  'from-sky-500/30 to-indigo-500/20',
  'from-emerald-500/30 to-teal-400/20',
  'from-violet-500/30 to-fuchsia-500/20',
  'from-amber-500/30 to-rose-500/20',
  'from-cyan-500/30 to-blue-500/20',
]

function initials(name: string): string {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase()
}
function hashIndex(seed: string, mod: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(h) % mod
}

/**
 * Portrait actor headshot (2:3). Uses the real TMDB photo when available,
 * otherwise a tasteful gradient placeholder with the actor's initials.
 */
export function CastPortrait({ name, className }: { name: string; className?: string }) {
  const url = castPhoto(name)
  const [failed, setFailed] = useState(false)
  const showImg = !!url && !failed
  const grad = GRADIENTS[hashIndex(name, GRADIENTS.length)]

  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-ink-800', className)}>
      <div className={cn('absolute inset-0 grid place-items-center bg-linear-to-br/srgb', grad)}>
        <span className="font-display text-2xl font-extrabold text-white/80">
          {initials(name)}
        </span>
      </div>
      {showImg && (
        <img
          src={url}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/cast:scale-105"
        />
      )}
    </div>
  )
}
