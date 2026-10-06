import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Ticket, ArrowRight } from 'lucide-react'
import { useBookingStore, seatPrice } from '../../store/useBookingStore'
import { showtimeById } from '../../data/showtimes'
import { filmById } from '../../data/films'
import { cinemaById } from '../../data/cinemas'
import { useLocale } from '../../hooks/useLocale'
import { dateLabel } from '../../lib/format'

/**
 * Floating mini-cart. Appears whenever an in-progress seat selection exists,
 * except on the pages that already render a full order summary.
 */
export function BookingBar() {
  const { pathname } = useLocation()
  const { money } = useLocale()
  const seats = useBookingStore((s) => s.seats)
  const showtimeId = useBookingStore((s) => s.showtimeId)

  const hiddenRoutes = ['/checkout', '/confirmation', '/seats']
  const hidden = hiddenRoutes.some((r) => pathname.startsWith(r))

  const showtime = showtimeId ? showtimeById(showtimeId) : undefined
  const film = showtime ? filmById(showtime.filmId) : undefined
  const cinema = showtime ? cinemaById(showtime.cinemaId) : undefined

  const show = seats.length > 0 && !!showtime && !!film && !hidden
  const total = showtime
    ? seats.reduce((sum, s) => sum + seatPrice(showtime.basePrice, s), 0)
    : 0

  return (
    <AnimatePresence>
      {show && showtime && film && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl glass-strong px-4 py-3 shadow-card">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-300/15 text-gold-300">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{film.title}</p>
              <p className="truncate text-xs text-slate-400">
                {cinema?.name} · {dateLabel(showtime.date)} · {showtime.time} ·{' '}
                {seats.length} {seats.length === 1 ? 'seat' : 'seats'}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">Total</p>
              <p className="text-base font-bold text-gold-200">{money(total)}</p>
            </div>
            <Link
              to="/checkout"
              className="flex shrink-0 items-center gap-1.5 rounded-md bg-linear-to-b/srgb from-crimson-500 to-crimson-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow-crimson transition-transform hover:-translate-y-0.5"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
