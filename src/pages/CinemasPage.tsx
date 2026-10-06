import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Check,
  Star,
  Phone,
  Navigation,
  Clapperboard,
} from 'lucide-react'
import { cinemas } from '../data/cinemas'
import { showtimesAtCinema, upcomingDates } from '../data/showtimes'
import { filmById } from '../data/films'
import { usePreferences } from '../store/usePreferences'
import { useBookingStore } from '../store/useBookingStore'
import { Container } from '../components/ui/Section'
import { cn } from '../lib/cn'

export default function CinemasPage() {
  const navigate = useNavigate()
  const cinemaId = usePreferences((s) => s.cinemaId)
  const setCinema = usePreferences((s) => s.setCinema)
  const startBooking = useBookingStore((s) => s.startBooking)

  const [selectedId, setSelectedId] = useState(cinemaId)
  const selected = cinemas.find((c) => c.id === selectedId)!
  const today = upcomingDates(1)[0]

  const todaysFilms = useMemo(() => {
    const list = showtimesAtCinema(selected.id, today)
    const grouped = new Map<string, typeof list>()
    list.forEach((s) => {
      const arr = grouped.get(s.filmId) ?? []
      arr.push(s)
      grouped.set(s.filmId, arr)
    })
    return Array.from(grouped.entries()).map(([filmId, times]) => ({
      film: filmById(filmId)!,
      times: times.sort((a, b) => a.time.localeCompare(b.time)),
    }))
  }, [selected.id, today])

  return (
    <Container className="pt-24">
      <div className="mb-8">
        <p className="eyebrow mb-2">Visit us</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Our cinemas</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Four locations across Riverside and Ashford, each with its own
          programme and signature experiences. Pick your local to make it your
          default.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Cinema list */}
        <div className="space-y-3">
          {cinemas.map((c) => {
            const isSelected = c.id === selectedId
            const isHome = c.id === cinemaId
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  'w-full rounded-2xl border p-5 text-left transition-all',
                  isSelected
                    ? 'border-gold-300/50 bg-gold-300/6'
                    : 'border-white/6 bg-ink-850/60 hover:border-white/20',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-white">
                      <MapPin className="h-4 w-4 text-gold-300" />
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {c.area}, {c.city}
                    </p>
                  </div>
                  {isHome && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-300/15 px-2 py-0.5 text-[10px] font-bold text-gold-200">
                      <Check className="h-3 w-3" /> Local
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.formats.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {c.screens} screens · {c.distanceKm} km away
                </p>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="space-y-6">
          {/* Map placeholder */}
          <div className="grain relative h-56 overflow-hidden rounded-3xl border border-white/6">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 120% at 30% 20%, rgba(236,178,46,0.18), transparent 55%), linear-gradient(160deg, #13131d, #06060a)',
                backgroundSize: '100% 100%',
              }}
            />
            {/* faux streets */}
            <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
              <defs>
                <pattern id="streets" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M0 24 H48 M24 0 V48" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-crimson-600 text-white shadow-glow-crimson">
                <MapPin className="h-6 w-6" />
                <span className="absolute inset-0 animate-pulse-ring rounded-full" />
              </span>
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl glass px-3 py-2 text-xs text-slate-300">
              {selected.address}
            </div>
          </div>

          {/* Info card */}
          <div className="rounded-2xl border border-white/6 bg-ink-850/60 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <Star className="h-4 w-4 fill-gold-300 text-gold-300" /> 4.7 · {selected.screens} screens
                </p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/6">
                  <Navigation className="h-4 w-4" /> Directions
                </button>
                <button
                  onClick={() => setCinema(selected.id)}
                  disabled={selected.id === cinemaId}
                  className="inline-flex items-center gap-1.5 rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-4 py-2 text-sm font-bold text-ink-950 disabled:opacity-50"
                >
                  {selected.id === cinemaId ? 'Your local' : 'Make my local'}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Amenities
                </p>
                <ul className="space-y-1.5">
                  {selected.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-emerald-400" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-slate-300">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold-300" /> 0123 456 789
                </p>
                <p className="mt-1.5 flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  {selected.address}
                </p>
              </div>
            </div>
          </div>

          {/* Today's showtimes */}
          <div className="rounded-2xl border border-white/6 bg-ink-850/60 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Clapperboard className="h-5 w-5 text-gold-300" /> Showing today
            </h3>
            {todaysFilms.length === 0 ? (
              <p className="text-sm text-slate-400">
                No screenings scheduled today at this location.
              </p>
            ) : (
              <div className="space-y-4">
                {todaysFilms.map(({ film, times }) => (
                  <div
                    key={film.id}
                    className="flex flex-wrap items-center gap-3 border-b border-white/4 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="min-w-[160px] flex-1 text-sm font-semibold text-white">
                      {film.title}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {times.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            startBooking(s.filmId, s.cinemaId, s.id)
                            navigate(`/seats/${s.id}`)
                          }}
                          className="rounded-lg border border-white/10 bg-white/3 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:border-gold-300/50 hover:bg-gold-300/10"
                        >
                          {s.time}
                          <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                            {s.format}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
