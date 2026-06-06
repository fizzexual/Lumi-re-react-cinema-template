import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Armchair } from 'lucide-react'
import { showtimesForFilm, upcomingDates } from '../../data/showtimes'
import { cinemas, cinemaById, cities } from '../../data/cinemas'
import type { Showtime } from '../../data/types'
import { useBookingStore } from '../../store/useBookingStore'
import { usePreferences } from '../../store/usePreferences'
import { relativeDay, dayNumber, monthShort } from '../../lib/format'
import { FormatLogo } from '../ui/Brand'
import { cn } from '../../lib/cn'

export function ShowtimesPicker({ filmId }: { filmId: string }) {
  const navigate = useNavigate()
  const startBooking = useBookingStore((s) => s.startBooking)
  const preferredCinema = cinemaById(usePreferences((s) => s.cinemaId))

  const dates = useMemo(() => upcomingDates(7), [])
  const [date, setDate] = useState(dates[0])
  const [city, setCity] = useState<string>(preferredCinema?.city ?? 'all')

  const all = useMemo(() => showtimesForFilm(filmId), [filmId])

  const byCinema = useMemo(() => {
    const onDate = all.filter((s) => s.date === date)
    return cinemas
      .filter((c) => city === 'all' || c.city === city)
      .map((c) => ({
        cinema: c,
        times: onDate
          .filter((s) => s.cinemaId === c.id)
          .sort((a, b) => a.time.localeCompare(b.time)),
      }))
      .filter((group) => group.times.length > 0)
  }, [all, date, city])

  function pick(s: Showtime) {
    startBooking(s.filmId, s.cinemaId, s.id)
    navigate(`/seats/${s.id}`)
  }

  return (
    <div>
      {/* Date rail */}
      <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
        {dates.map((d) => {
          const active = d === date
          return (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={cn(
                'flex min-w-[68px] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-all',
                active
                  ? 'border-gold-300/60 bg-gold-300/15 text-gold-100'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25',
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                {relativeDay(d)}
              </span>
              <span className="text-xl font-bold leading-tight">{dayNumber(d)}</span>
              <span className="text-[11px] text-slate-400">{monthShort(d)}</span>
            </button>
          )
        })}
      </div>

      {/* City filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CityChip label="All cinemas" active={city === 'all'} onClick={() => setCity('all')} />
        {cities.map((c) => (
          <CityChip key={c} label={c} active={city === c} onClick={() => setCity(c)} />
        ))}
      </div>

      {/* Cinemas + times */}
      {byCinema.length === 0 ? (
        <p className="rounded-2xl border border-white/[0.06] bg-ink-850/60 px-5 py-8 text-center text-sm text-slate-400">
          No screenings on this date. Try another day.
        </p>
      ) : (
        <div className="space-y-4">
          {byCinema.map(({ cinema, times }) => (
            <div
              key={cinema.id}
              className="rounded-2xl border border-white/[0.06] bg-ink-850/60 p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="flex items-center gap-2 text-base font-bold text-white">
                    <MapPin className="h-4 w-4 text-gold-300" />
                    {cinema.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {cinema.area}, {cinema.city} · {cinema.distanceKm} km
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {times.map((s) => (
                  <ShowtimeChip key={s.id} showtime={s} onPick={() => pick(s)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CityChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-gold-300/60 bg-gold-300/15 text-gold-200'
          : 'border-white/10 text-slate-300 hover:border-white/25',
      )}
    >
      {label}
    </button>
  )
}

function ShowtimeChip({
  showtime,
  onPick,
}: {
  showtime: Showtime
  onPick: () => void
}) {
  const sold = showtime.soldFraction
  const seatsLeft = Math.round((1 - sold) * 120)
  const status =
    sold > 0.85 ? 'low' : sold > 0.6 ? 'filling' : 'good'

  const statusColor = {
    low: 'text-crimson-400',
    filling: 'text-gold-300',
    good: 'text-emerald-400',
  }[status]

  return (
    <button
      onClick={onPick}
      className="group/chip relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-gold-300/50 hover:bg-gold-300/[0.06]"
    >
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-white">{showtime.time}</span>
        <FormatLogo format={showtime.format} size="sm" />
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <Armchair className={cn('h-3 w-3', statusColor)} />
        <span className={cn('text-[11px] font-medium', statusColor)}>
          {status === 'low'
            ? `Only ${seatsLeft} left`
            : status === 'filling'
            ? 'Filling up'
            : `${seatsLeft} seats`}
        </span>
      </div>
      {/* Availability bar */}
      <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-ink-700">
        <span
          className={cn(
            'block h-full rounded-full',
            status === 'low'
              ? 'bg-crimson-500'
              : status === 'filling'
              ? 'bg-gold-400'
              : 'bg-emerald-500',
          )}
          style={{ width: `${Math.round(sold * 100)}%` }}
        />
      </span>
    </button>
  )
}
