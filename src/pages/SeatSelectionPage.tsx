import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ArrowRight, X, Armchair, Info, Zap } from 'lucide-react'
import { showtimeById } from '../data/showtimes'
import { filmById } from '../data/films'
import { cinemaById } from '../data/cinemas'
import { Container } from '../components/ui/Section'
import { SeatMap } from '../components/seats/SeatMap'
import { useBookingStore, seatPrice } from '../store/useBookingStore'
import { useLocale } from '../hooks/useLocale'
import { dateLabel } from '../lib/format'
import { Stepper } from '../components/ui/Stepper'

export default function SeatSelectionPage() {
  const { showtimeId } = useParams()
  const navigate = useNavigate()
  const { money } = useLocale()

  const showtime = showtimeId ? showtimeById(showtimeId) : undefined
  const film = showtime ? filmById(showtime.filmId) : undefined
  const cinema = showtime ? cinemaById(showtime.cinemaId) : undefined

  const seats = useBookingStore((s) => s.seats)
  const toggleSeat = useBookingStore((s) => s.toggleSeat)
  const clearSeats = useBookingStore((s) => s.clearSeats)
  const startBooking = useBookingStore((s) => s.startBooking)

  // Ensure booking context is set (e.g. on direct navigation / refresh).
  useEffect(() => {
    if (showtime) startBooking(showtime.filmId, showtime.cinemaId, showtime.id)
  }, [showtime, startBooking])

  if (!showtime || !film || !cinema) {
    return (
      <Container className="grid min-h-[60vh] place-items-center pt-24 text-center">
        <div>
          <h1 className="text-2xl font-bold">Showtime unavailable</h1>
          <p className="mt-2 text-slate-400">This screening may have ended or sold out.</p>
          <Link to="/browse" className="mt-4 inline-block text-gold-300 hover:underline">
            ← Browse films
          </Link>
        </div>
      </Container>
    )
  }

  const subtotal = seats.reduce((sum, s) => sum + seatPrice(showtime.basePrice, s), 0)
  const premiumCount = seats.filter((s) => s.rowTier === 'premium').length
  const standardCount = seats.length - premiumCount

  const autoSelect = (list: Parameters<typeof toggleSeat>[0][]) => {
    clearSeats()
    list.forEach((s) => toggleSeat(s))
  }

  return (
    <Container className="pt-24">
      <Stepper current={1} />

      <div className="mb-6 mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to={`/film/${film.slug}`}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> {film.title}
          </Link>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Choose your seats</h1>
          <p className="mt-1 text-sm text-slate-400">
            {cinema.name} · {dateLabel(showtime.date)} · {showtime.time} ·{' '}
            <span className="font-semibold text-gold-200">{showtime.format}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3.5 py-1.5 text-xs font-medium text-emerald-300">
          <Zap className="h-3.5 w-3.5" /> Live availability
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Seat map */}
        <div className="overflow-x-auto rounded-3xl border border-white/[0.06] bg-ink-850/40 p-6 sm:p-10">
          <SeatMap
            seed={showtime.id}
            soldFraction={showtime.soldFraction}
            basePrice={showtime.basePrice}
            selected={seats}
            onToggle={toggleSeat}
            onAutoSelect={autoSelect}
          />
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/[0.06] bg-ink-850/70 p-5">
            <h2 className="text-lg font-bold">Your selection</h2>

            {seats.length === 0 ? (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                Tap an available seat to begin. Premium recliners are highlighted
                in violet.
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {seats
                  .slice()
                  .sort((a, b) => a.row.localeCompare(b.row) || a.col - b.col)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        toggleSeat({ id: s.id, row: s.row, col: s.col, rowTier: s.rowTier })
                      }
                      className="group inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-300/10 px-3 py-1.5 text-sm font-semibold text-gold-100"
                    >
                      {s.row}
                      {s.col}
                      {s.rowTier === 'premium' && (
                        <Armchair className="h-3 w-3 text-violet-300" />
                      )}
                      <X className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                    </button>
                  ))}
              </div>
            )}

            <dl className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <dt>Seats</dt>
                <dd className="font-medium text-white">{seats.length} / 10</dd>
              </div>
              {standardCount > 0 && (
                <div className="flex justify-between text-slate-400">
                  <dt>Standard × {standardCount}</dt>
                  <dd className="text-white">{money(standardCount * showtime.basePrice)}</dd>
                </div>
              )}
              {premiumCount > 0 && (
                <div className="flex justify-between text-slate-400">
                  <dt className="flex items-center gap-1.5">
                    <Armchair className="h-3.5 w-3.5 text-violet-300" /> Premium × {premiumCount}
                  </dt>
                  <dd className="text-white">{money(premiumCount * showtime.basePrice * 1.28)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-white/[0.06] pt-2 text-base">
                <dt className="font-semibold text-white">Subtotal</dt>
                <dd className="font-bold text-gold-200">{money(subtotal)}</dd>
              </div>
              <p className="pt-1 text-xs text-slate-500">
                Choose ticket types (adult, child, student…) at checkout.
              </p>
            </dl>

            <button
              disabled={seats.length === 0}
              onClick={() => navigate('/checkout')}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-crimson-500 to-crimson-600 py-3.5 text-sm font-bold text-white shadow-glow-crimson transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
            >
              Continue to checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </Container>
  )
}
