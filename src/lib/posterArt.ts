import type { Film } from '../data/types'

/**
 * Procedural "key art". Rather than ship licensed stills, we synthesise a
 * cohesive, deterministic gradient composition per film from its palette so the
 * whole catalogue looks art-directed and never shows a broken image.
 */

function hashAngles(seed: string): { a: number; b: number; c: number } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const u = Math.abs(h)
  return {
    a: 15 + (u % 60),
    b: 20 + ((u >> 3) % 70),
    c: 30 + ((u >> 6) % 60),
  }
}

/** Layered background for poster cards (portrait). */
export function posterBackground(film: Film): string {
  const [c1, c2] = film.palette
  const { a, b } = hashAngles(film.id)
  return [
    `radial-gradient(120% 80% at ${a}% 0%, ${c2}55 0%, transparent 55%)`,
    `radial-gradient(90% 70% at ${b}% 100%, ${c1} 0%, transparent 60%)`,
    `linear-gradient(160deg, ${c1} 0%, #06060a 92%)`,
  ].join(', ')
}

/** Wider, more atmospheric variant for hero/backdrop panels (landscape). */
export function backdropBackground(film: Film): string {
  const [c1, c2] = film.palette
  const { a, b, c } = hashAngles(film.id + 'bd')
  return [
    `radial-gradient(60% 120% at ${a}% 10%, ${c2}66 0%, transparent 55%)`,
    `radial-gradient(50% 90% at ${100 - b}% 90%, ${film.accent}44 0%, transparent 55%)`,
    `radial-gradient(80% 140% at ${c}% 120%, ${c1} 0%, transparent 70%)`,
    `linear-gradient(110deg, ${c1} 0%, #06060a 80%)`,
  ].join(', ')
}

/** A faint "sheen" sweep used as an extra layer over the art. */
export function sheen(): string {
  return 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, transparent 60%)'
}
