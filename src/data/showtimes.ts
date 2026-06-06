import type { Film, Format, Showtime } from './types'
import { films } from './films'
import { cinemas } from './cinemas'

/** Tiny deterministic PRNG (mulberry32) so showtimes are stable per render. */
function seeded(seedStr: string) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SLOTS = ['11:00', '13:30', '15:45', '17:30', '19:15', '20:45', '21:30', '22:15']

const FORMAT_PRICE: Record<Format, number> = {
  Standard: 11.5,
  Premium: 16.0,
  IMAX: 18.5,
  'Dolby Atmos': 16.5,
  '4DX': 19.0,
  '35mm': 13.5,
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** The next `count` calendar days starting today (local). */
export function upcomingDates(count = 7): string[] {
  const out: string[] = []
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  for (let i = 0; i < count; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    out.push(toISODate(d))
  }
  return out
}

/**
 * Generate showtimes for a film at a cinema on a given date. Only formats the
 * cinema actually supports for that film are scheduled.
 */
function generateFor(film: Film, cinemaId: string, date: string): Showtime[] {
  const cinema = cinemas.find((c) => c.id === cinemaId)!
  if (film.status === 'coming-soon') return []
  const sharedFormats = film.formats.filter((f) => cinema.formats.includes(f))
  if (sharedFormats.length === 0) return []

  const rnd = seeded(film.id + cinemaId + date)
  // Larger multiplexes run more sessions.
  const sessionCount = Math.max(2, Math.round(cinema.screens / 2.5))
  const chosen = [...SLOTS].sort(() => rnd() - 0.5).slice(0, sessionCount).sort()

  return chosen.map((time, i) => {
    const format = sharedFormats[Math.floor(rnd() * sharedFormats.length)]
    // Prime-time evening sessions sell harder.
    const hour = parseInt(time.slice(0, 2), 10)
    const prime = hour >= 18 && hour <= 21 ? 0.28 : 0
    const soldFraction = Math.min(0.97, 0.18 + rnd() * 0.5 + prime)
    return {
      id: `${film.id}-${cinemaId}-${date}-${i}`,
      filmId: film.id,
      cinemaId,
      date,
      time,
      format,
      basePrice: FORMAT_PRICE[format],
      soldFraction,
    }
  })
}

/** All showtimes for a film across the network for the upcoming week. */
export function showtimesForFilm(filmId: string, days = 7): Showtime[] {
  const film = films.find((f) => f.id === filmId)
  if (!film) return []
  const dates = upcomingDates(days)
  return cinemas.flatMap((c) =>
    dates.flatMap((d) => generateFor(film, c.id, d)),
  )
}

/** All showtimes at one cinema on one date, grouped-ready. */
export function showtimesAtCinema(cinemaId: string, date: string): Showtime[] {
  return films.flatMap((f) => generateFor(f, cinemaId, date))
}

export function showtimeById(id: string): Showtime | undefined {
  // id encodes filmId-cinemaId-date-index; regenerate that day and find it.
  const parts = id.split('-')
  if (parts.length < 4) return undefined
  const filmId = parts[0]
  const cinemaId = parts[1]
  const date = parts.slice(2, 5).join('-')
  const film = films.find((f) => f.id === filmId)
  if (!film) return undefined
  return generateFor(film, cinemaId, date).find((s) => s.id === id)
}
