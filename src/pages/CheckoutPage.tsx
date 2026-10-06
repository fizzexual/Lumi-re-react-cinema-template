import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Lock,
  Tag,
  CreditCard,
  Loader2,
  Armchair,
  CheckCircle2,
} from 'lucide-react'
import {
  useBookingStore,
  seatPrice,
  TICKET_TIER,
} from '../store/useBookingStore'
import type { TicketTier } from '../data/types'
import { showtimeById } from '../data/showtimes'
import { filmById } from '../data/films'
import { cinemaById } from '../data/cinemas'
import { Container } from '../components/ui/Section'
import { Stepper } from '../components/ui/Stepper'
import { Poster } from '../components/ui/Poster'
import { PaymentLogos } from '../components/ui/Brand'
import { useLocale } from '../hooks/useLocale'
import { dateLabel } from '../lib/format'
import { cn } from '../lib/cn'

const BOOKING_FEE = 1.2
const PROMO = { code: 'LUMIERE10', rate: 0.1 }
const TIERS: TicketTier[] = ['adult', 'student', 'senior', 'child']

function makeRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `LMR-${s}`
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { money } = useLocale()

  const seats = useBookingStore((s) => s.seats)
  const showtimeId = useBookingStore((s) => s.showtimeId)
  const setSeatTicket = useBookingStore((s) => s.setSeatTicket)
  const confirmBooking = useBookingStore((s) => s.confirmBooking)

  const showtime = showtimeId ? showtimeById(showtimeId) : undefined
  const film = showtime ? filmById(showtime.filmId) : undefined
  const cinema = showtime ? cinemaById(showtime.cinemaId) : undefined

  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [contact, setContact] = useState({ name: '', email: '' })
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })

  const subtotal = useMemo(
    () =>
      showtime ? seats.reduce((sum, s) => sum + seatPrice(showtime.basePrice, s), 0) : 0,
    [seats, showtime],
  )
  const discount = promoApplied ? subtotal * PROMO.rate : 0
  const fee = seats.length > 0 ? BOOKING_FEE : 0
  const total = subtotal - discount + fee

  if (!showtime || !film || !cinema || seats.length === 0) {
    return (
      <Container className="grid min-h-[60vh] place-items-center pt-24 text-center">
        <div>
          <h1 className="text-2xl font-bold">Your basket is empty</h1>
          <p className="mt-2 text-slate-400">Pick a film and some seats to check out.</p>
          <Link
            to="/browse"
            className="mt-5 inline-block rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-6 py-3 text-sm font-bold text-ink-950"
          >
            Browse films
          </Link>
        </div>
      </Container>
    )
  }

  const formValid =
    contact.name.trim() &&
    /.+@.+\..+/.test(contact.email) &&
    card.number.replace(/\s/g, '').length >= 15 &&
    card.expiry.length >= 4 &&
    card.cvc.length >= 3

  function pay() {
    if (!formValid || !showtime) return
    setProcessing(true)
    const ref = makeRef()
    // Simulate a payment round-trip.
    setTimeout(() => {
      confirmBooking({
        ref,
        filmId: showtime.filmId,
        cinemaId: showtime.cinemaId,
        showtimeId: showtime.id,
        date: showtime.date,
        time: showtime.time,
        format: showtime.format,
        seats,
        totalGBP: total,
        createdAtISO: new Date().toISOString(),
      })
      navigate(`/confirmation/${ref}`)
    }, 1400)
  }

  return (
    <Container className="pt-24">
      <Stepper current={2} />

      <div className="mb-6 mt-8">
        <Link
          to={`/seats/${showtime.id}`}
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" /> Back to seats
        </Link>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Ticket types */}
          <Panel title="Ticket types" subtitle="Assign a price band to each seat">
            <div className="space-y-2.5">
              {seats
                .slice()
                .sort((a, b) => a.row.localeCompare(b.row) || a.col - b.col)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/6 bg-white/2 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-300/15 text-sm font-bold text-gold-200">
                        {s.row}
                        {s.col}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Seat {s.row}
                          {s.col}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          {s.rowTier === 'premium' ? (
                            <>
                              <Armchair className="h-3 w-3 text-violet-300" /> Premium
                              recliner
                            </>
                          ) : (
                            'Standard'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={s.ticket}
                        onChange={(e) =>
                          setSeatTicket(s.id, e.target.value as TicketTier)
                        }
                        className="cursor-pointer rounded-lg border border-white/10 bg-ink-800 px-3 py-1.5 text-sm font-medium text-white outline-hidden focus:border-gold-300/50 [&>option]:bg-ink-800"
                      >
                        {TIERS.map((tier) => (
                          <option key={tier} value={tier}>
                            {TICKET_TIER[tier].label}
                          </option>
                        ))}
                      </select>
                      <span className="w-16 text-right text-sm font-semibold text-white">
                        {money(seatPrice(showtime.basePrice, s))}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>

          {/* Contact */}
          <Panel title="Your details" subtitle="Tickets are sent here">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Full name"
                value={contact.name}
                onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                placeholder="Alex Rivera"
              />
              <Field
                label="Email"
                type="email"
                value={contact.email}
                onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                placeholder="alex@example.com"
              />
            </div>
          </Panel>

          {/* Payment */}
          <Panel
            title="Payment"
            subtitle="Encrypted & secure"
            icon={<PaymentLogos />}
          >
            <Field
              label="Card number"
              value={card.number}
              onChange={(v) =>
                setCard((c) => ({ ...c, number: formatCardNumber(v) }))
              }
              placeholder="4242 4242 4242 4242"
              icon={<CreditCard className="h-4 w-4 text-slate-400" />}
              inputMode="numeric"
              maxLength={19}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field
                label="Expiry"
                value={card.expiry}
                onChange={(v) => setCard((c) => ({ ...c, expiry: formatExpiry(v) }))}
                placeholder="MM/YY"
                inputMode="numeric"
                maxLength={5}
              />
              <Field
                label="CVC"
                value={card.cvc}
                onChange={(v) =>
                  setCard((c) => ({ ...c, cvc: v.replace(/\D/g, '').slice(0, 4) }))
                }
                placeholder="123"
                inputMode="numeric"
                maxLength={4}
              />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3 w-3" /> Your payment is encrypted — we never store
              your card details.
            </p>
          </Panel>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-white/6 bg-ink-850/70">
            <div className="flex gap-3 border-b border-white/6 p-4">
              <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg">
                <Poster film={film} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{film.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{cinema.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {dateLabel(showtime.date)} · {showtime.time}
                </p>
                <span className="mt-1.5 inline-block rounded-md bg-gold-300/15 px-2 py-0.5 text-[11px] font-semibold text-gold-200">
                  {showtime.format}
                </span>
              </div>
            </div>

            {/* Promo */}
            <div className="border-b border-white/6 p-4">
              {promoApplied ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-400/8 px-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2 font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" /> {PROMO.code} applied
                  </span>
                  <button
                    onClick={() => {
                      setPromoApplied(false)
                      setPromoInput('')
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="w-full bg-transparent py-2.5 text-sm text-white outline-hidden placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    onClick={() =>
                      setPromoApplied(promoInput.trim() === PROMO.code)
                    }
                    className="rounded-xl bg-white/6 px-4 text-sm font-semibold text-white hover:bg-white/12"
                  >
                    Apply
                  </button>
                </div>
              )}
              {!promoApplied && (
                <p className="mt-2 text-xs text-slate-500">
                  Try <span className="font-mono text-gold-300">LUMIERE10</span> for 10% off.
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 p-4 text-sm">
              <Row label={`Tickets (${seats.length})`} value={money(subtotal)} />
              {discount > 0 && (
                <Row label="Promo discount" value={`–${money(discount)}`} accent />
              )}
              <Row label="Booking fee" value={money(fee)} muted />
              <div className="mt-2 flex items-center justify-between border-t border-white/6 pt-3">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-xl font-extrabold text-gold-200">
                  {money(total)}
                </span>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={pay}
                disabled={!formValid || processing}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-b/srgb from-crimson-500 to-crimson-600 py-3.5 text-sm font-bold text-white shadow-glow-crimson transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Pay {money(total)}
                  </>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3 w-3" /> Secured with 256-bit encryption
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/6 bg-ink-850/50 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        {icon}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  inputMode,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: ReactNode
  inputMode?: 'numeric' | 'text'
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3.5 transition-colors focus-within:border-gold-300/50">
        {icon}
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-2.5 text-sm text-white outline-hidden placeholder:text-slate-500"
        />
      </span>
    </label>
  )
}

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string
  value: string
  muted?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn(muted ? 'text-slate-500' : 'text-slate-300')}>{label}</span>
      <span
        className={cn(
          'font-medium',
          accent ? 'text-emerald-400' : 'text-white',
        )}
      >
        {value}
      </span>
    </div>
  )
}

function formatCardNumber(v: string): string {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
