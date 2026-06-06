import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, MapPin, Clock, Ticket, ArrowRight } from 'lucide-react'
import { useBookingStore, TICKET_TIER } from '../store/useBookingStore'
import { filmById } from '../data/films'
import { cinemaById } from '../data/cinemas'
import { Container } from '../components/ui/Section'
import { Stepper } from '../components/ui/Stepper'
import { QrPlaceholder } from '../components/ui/QrPlaceholder'
import { useLocale } from '../hooks/useLocale'
import { dateLabel } from '../lib/format'

export default function ConfirmationPage() {
  const { ref } = useParams()
  const { money } = useLocale()
  const history = useBookingStore((s) => s.history)
  const booking = history.find((b) => b.ref === ref)

  useEffect(() => {
    if (booking) {
      // A small celebratory scroll-lock-free confetti could go here.
      window.scrollTo({ top: 0 })
    }
  }, [booking])

  const film = booking ? filmById(booking.filmId) : undefined
  const cinema = booking ? cinemaById(booking.cinemaId) : undefined

  if (!booking || !film || !cinema) {
    return (
      <Container className="grid min-h-[60vh] place-items-center pt-24 text-center">
        <div>
          <h1 className="text-2xl font-bold">Booking not found</h1>
          <Link to="/account" className="mt-4 inline-block text-gold-300 hover:underline">
            View my bookings →
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="pt-24">
      <Stepper current={3} />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-400"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 text-center"
      >
        <h1 className="text-3xl font-extrabold">You’re booked in!</h1>
        <p className="mt-2 text-slate-400">
          We’ve emailed your tickets. Booking reference{' '}
          <span className="font-mono font-semibold text-gold-200">{booking.ref}</span>
        </p>
      </motion.div>

      {/* Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mx-auto mt-10 max-w-xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-850 shadow-card">
          {/* Top: film + showtime */}
          <div className="grain relative grid grid-cols-[1fr_auto] gap-4 p-6">
            <div>
              <p className="eyebrow mb-1">{film.genres.slice(0, 2).join(' · ')}</p>
              <h2 className="font-display text-2xl font-extrabold leading-tight text-white">
                {film.title}
              </h2>
              <span className="mt-2 inline-block rounded-md bg-gold-300/15 px-2 py-0.5 text-xs font-semibold text-gold-200">
                {booking.format}
              </span>
            </div>
            <QrPlaceholder seed={booking.ref} className="h-24 w-24" />
          </div>

          {/* Perforation */}
          <div className="relative">
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink-950" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink-950" />
            <div className="border-t border-dashed border-white/15" />
          </div>

          {/* Bottom: details */}
          <div className="grid grid-cols-2 gap-4 p-6 text-sm sm:grid-cols-4">
            <Detail icon={Calendar} label="Date" value={dateLabel(booking.date)} />
            <Detail icon={Clock} label="Time" value={booking.time} />
            <Detail icon={MapPin} label="Cinema" value={cinema.name} />
            <Detail
              icon={Ticket}
              label="Seats"
              value={booking.seats
                .map((s) => `${s.row}${s.col}`)
                .join(', ')}
            />
          </div>

          {/* Line items */}
          <div className="border-t border-white/[0.06] px-6 py-4">
            <ul className="space-y-1.5 text-sm">
              {booking.seats.map((s) => (
                <li key={s.id} className="flex justify-between text-slate-300">
                  <span>
                    Seat {s.row}
                    {s.col} · {TICKET_TIER[s.ticket].label}
                    {s.rowTier === 'premium' && ' · Premium'}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-white/[0.06] pt-3">
              <span className="font-semibold text-white">Total paid</span>
              <span className="font-extrabold text-gold-200">
                {money(booking.totalGBP)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/account"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-gold-300 to-gold-500 py-3.5 text-sm font-bold text-ink-950 shadow-glow"
          >
            View my bookings <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/browse"
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.06]"
          >
            Book another film
          </Link>
        </div>
      </motion.div>
    </Container>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}
