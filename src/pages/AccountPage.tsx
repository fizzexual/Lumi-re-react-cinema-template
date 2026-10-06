import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Ticket,
  Clock,
  MapPin,
  Calendar,
  Crown,
  Film as FilmIcon,
  Heart,
  Globe,
  Star,
  Clapperboard,
  Building2,
  CalendarPlus,
  Navigation,
  Pencil,
  Settings,
  Bell,
  ChevronRight,
  Trophy,
  Wallet,
  BarChart3,
  Bookmark,
  Play,
} from 'lucide-react'
import { useBookingStore } from '../store/useBookingStore'
import { usePreferences } from '../store/usePreferences'
import { films, filmById, allGenres } from '../data/films'
import { cinemaById } from '../data/cinemas'
import type { Booking } from '../store/useBookingStore'
import { Container, SectionHeader } from '../components/ui/Section'
import { FilmRail } from '../components/ui/FilmRail'
import { Avatar } from '../components/ui/Avatar'
import { Poster, Backdrop } from '../components/ui/Poster'
import { CountUp } from '../components/ui/CountUp'
import { QrPlaceholder } from '../components/ui/QrPlaceholder'
import { Chip } from '../components/ui/Badge'
import { LANGUAGES, CURRENCIES } from '../lib/i18n'
import { useLocale } from '../hooks/useLocale'
import { recommendFromGenres } from '../lib/recommendations'
import { dateLabel, daysUntil } from '../lib/format'
import { cn } from '../lib/cn'

type Tab = 'upcoming' | 'past' | 'watchlist' | 'preferences'

const LOYALTY = { points: 2480, tier: 'Gold', next: 'Platinum', threshold: 3000 }

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>('upcoming')
  const history = useBookingStore((s) => s.history)
  const likedGenres = usePreferences((s) => s.likedGenres)
  const watchlist = usePreferences((s) => s.watchlist)

  const upcoming = history
    .filter((b) => b.status === 'upcoming')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
  const past = history.filter((b) => b.status === 'completed')
  const recommended = recommendFromGenres(likedGenres, 8)

  // Insights from history.
  const watchedFilms = past.map((b) => filmById(b.filmId)).filter(Boolean)
  const hoursInDark = Math.round(
    (watchedFilms.reduce((s, f) => s + (f?.runtime ?? 0), 0) + 47 * 130) / 60,
  )
  const cinemasVisited = new Set(history.map((b) => b.cinemaId)).size

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { key: 'past', label: 'History', count: past.length },
    { key: 'watchlist', label: 'Watchlist', count: watchlist.length },
    { key: 'preferences', label: 'Preferences' },
  ]

  const bannerFilm = filmById(watchlist[0]) ?? films[0]

  return (
    <Container className="pt-20">
      {/* ---------- Profile hero ---------- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/6">
        {/* banner */}
        <div className="relative h-40 sm:h-48">
          <Backdrop film={bannerFilm} />
          <div className="absolute inset-0 bg-linear-to-t/srgb from-ink-900 via-ink-900/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r/srgb from-ink-900/80 to-transparent" />
          <div className="absolute right-4 top-4 flex gap-2">
            <HeaderAction icon={Pencil} label="Edit" />
            <HeaderAction icon={Settings} label="Settings" />
          </div>
        </div>

        <div className="relative -mt-12 px-5 pb-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <Avatar
                name="Alex Rivera"
                size="lg"
                className="h-24! w-24! text-3xl! ring-4 ring-ink-900"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold">Alex Rivera</h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r/srgb from-gold-300/25 to-gold-500/10 px-3 py-1 text-xs font-bold text-gold-200 ring-1 ring-gold-300/30">
                    <Crown className="h-3.5 w-3.5" /> Unlimited
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  @alexrivera · Member since 2023
                </p>
              </div>
            </div>

            {/* loyalty card */}
            <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-ink-850/80 p-4 backdrop-blur-sm lg:w-80">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Trophy className="h-4 w-4 text-gold-300" /> {LOYALTY.tier} tier
                </span>
                <span className="text-sm font-bold text-gold-200">
                  <CountUp value={LOYALTY.points} /> pts
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-700">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r/srgb from-gold-400 to-gold-200"
                  initial={{ width: 0 }}
                  animate={{ width: `${(LOYALTY.points / LOYALTY.threshold) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                {LOYALTY.threshold - LOYALTY.points} pts to{' '}
                <span className="font-semibold text-white">{LOYALTY.next}</span> · free
                large popcorn
              </p>
            </div>
          </div>

          {/* stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile icon={Clapperboard} label="Films seen" value={past.length + 47} />
            <StatTile icon={Clock} label="Hours in the dark" value={hoursInDark} suffix="h" />
            <StatTile icon={Building2} label="Cinemas visited" value={Math.max(cinemasVisited, 3)} />
            <StatTile icon={Wallet} label="Reward credits" value={18} suffix=" £" />
          </div>
        </div>
      </div>

      {/* ---------- Tabs ---------- */}
      <div className="sticky top-16 z-20 mt-8 flex gap-1 overflow-x-auto border-b border-white/8 bg-ink-950/80 backdrop-blur-xl">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors',
              tab === tb.key ? 'text-white' : 'text-neutral-400 hover:text-white',
            )}
          >
            {tb.label}
            {tb.count !== undefined && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/10 px-1.5 text-[11px]">
                {tb.count}
              </span>
            )}
            {tab === tb.key && (
              <motion.span
                layoutId="account-tab"
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-crimson-500"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'upcoming' && <UpcomingTab bookings={upcoming} />}
        {tab === 'past' && <HistoryTab bookings={past} />}
        {tab === 'watchlist' && <WatchlistTab ids={watchlist} />}
        {tab === 'preferences' && <Preferences />}
      </div>

      {/* ---------- Recommendations ---------- */}
      <div className="mt-16">
        <SectionHeader
          eyebrow="Because of your taste"
          title="Recommended for you"
          action={{ label: 'Browse all', to: '/browse' }}
        />
        <FilmRail films={recommended} />
      </div>
    </Container>
  )
}

/* ---------------------------------------------------------------- header bits */

function HeaderAction({ icon: Icon, label }: { icon: typeof Pencil; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/50">
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof Clock
  label: string
  value: number
  suffix?: string
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-ink-850/50 p-4">
      <Icon className="h-5 w-5 text-gold-300" />
      <CountUp
        value={value}
        suffix={suffix}
        className="mt-2 block font-display text-2xl font-extrabold text-white"
      />
      <p className="text-xs text-neutral-400">{label}</p>
    </div>
  )
}

/* ---------------------------------------------------------------- upcoming */

function UpcomingTab({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No upcoming bookings"
        body="When you book tickets, they’ll appear here with a scannable wallet pass."
      />
    )
  }
  const [next, ...rest] = bookings
  return (
    <div className="space-y-6">
      <NextUpCard booking={next} />
      {rest.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Also booked
          </h3>
          <div className="space-y-4">
            {rest.map((b) => (
              <BookingRow key={b.ref} booking={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NextUpCard({ booking }: { booking: Booking }) {
  const { money } = useLocale()
  const film = filmById(booking.filmId)
  const cinema = cinemaById(booking.cinemaId)
  if (!film || !cinema) return null
  const days = daysUntil(booking.date)
  const countdown = days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/8"
    >
      <div className="absolute inset-0">
        <Backdrop film={film} />
        <div className="absolute inset-0 bg-linear-to-r/srgb from-ink-950 via-ink-950/85 to-ink-950/40" />
      </div>

      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Bell className="h-3 w-3" /> Next up · {countdown}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
            {film.title}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gold-300" /> {dateLabel(booking.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gold-300" /> {booking.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold-300" /> {cinema.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Ticket className="h-4 w-4 text-gold-300" />{' '}
              {booking.seats.map((s) => `${s.row}${s.col}`).join(', ')}
            </span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
              {booking.format}
            </span>
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            Ref <span className="font-mono text-gold-200">{booking.ref}</span> ·{' '}
            {money(booking.totalGBP)} paid
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={calendarUrl(booking, film, cinema.address)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-bold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              <CalendarPlus className="h-4 w-4" /> Add to calendar
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinema.address)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
            >
              <Navigation className="h-4 w-4" /> Directions
            </a>
          </div>
        </div>

        {/* wallet pass */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm lg:flex-col">
          <QrPlaceholder seed={booking.ref} className="h-28 w-28" />
          <div className="lg:text-center">
            <p className="text-[11px] uppercase tracking-wider text-neutral-400">Scan at door</p>
            <p className="font-mono text-sm font-bold text-white">{booking.ref}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- history */

function HistoryTab({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Clapperboard}
        title="No past visits yet"
        body="Your watch history and ratings will build up here."
      />
    )
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {bookings.map((b) => (
          <BookingRow key={b.ref} booking={b} past />
        ))}
      </div>
      <InsightsPanel bookings={bookings} />
    </div>
  )
}

function InsightsPanel({ bookings }: { bookings: Booking[] }) {
  const { money } = useLocale()
  const allBookings = useBookingStore((s) => s.history)
  const watchlist = usePreferences((s) => s.watchlist)

  // Genre tally across watched + watchlisted.
  const tally = new Map<string, number>()
  ;[...allBookings.map((b) => b.filmId), ...watchlist].forEach((id) => {
    const f = filmById(id)
    f?.genres.forEach((g) => tally.set(g, (tally.get(g) ?? 0) + 1))
  })
  const topGenres = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxGenre = topGenres[0]?.[1] ?? 1

  const favCinemaId = mostFrequent(allBookings.map((b) => b.cinemaId))
  const favCinema = favCinemaId ? cinemaById(favCinemaId) : undefined
  const totalSpend = allBookings.reduce((s, b) => s + b.totalGBP, 0)

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-white/6 bg-ink-850/60 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <BarChart3 className="h-4 w-4 text-gold-300" /> Your taste in film
        </h3>
        <div className="mt-4 space-y-2.5">
          {bookings.length === 0 && <p className="text-sm text-neutral-400">Not enough data yet.</p>}
          {topGenres.map(([genre, count], i) => (
            <div key={genre} className="flex items-center gap-3 text-xs">
              <span className="w-20 shrink-0 text-neutral-300">{genre}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                <motion.span
                  className="block h-full rounded-full bg-linear-to-r/srgb from-crimson-500 to-gold-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(count / maxGenre) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/6 bg-ink-850/60 p-5">
        <h3 className="mb-3 text-sm font-bold">At a glance</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-neutral-400">
              <MapPin className="h-4 w-4" /> Favourite cinema
            </dt>
            <dd className="font-semibold text-white">{favCinema?.name.replace('Lumière ', '') ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-neutral-400">
              <Wallet className="h-4 w-4" /> Total spend
            </dt>
            <dd className="font-semibold text-white">{money(totalSpend)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-neutral-400">
              <Star className="h-4 w-4" /> Avg. rating given
            </dt>
            <dd className="font-semibold text-white">8.4 / 10</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}

/* ---------------------------------------------------------------- watchlist */

function WatchlistTab({ ids }: { ids: string[] }) {
  const toggleWatchlist = usePreferences((s) => s.toggleWatchlist)
  const list = ids.map((id) => filmById(id)).filter(Boolean)

  if (list.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Your watchlist is empty"
        body="Tap the heart on any film to save it here for later."
      />
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {list.map((film) => (
        <div key={film!.id} className="group relative">
          <Link
            to={`/film/${film!.slug}`}
            className="block aspect-2/3 overflow-hidden rounded-xl border border-white/6 shadow-card transition-transform group-hover:-translate-y-1"
          >
            <Poster film={film!} />
          </Link>
          <button
            onClick={() => toggleWatchlist(film!.id)}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-crimson-400 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
            aria-label="Remove from watchlist"
            title="Remove from watchlist"
          >
            <Heart className="h-4 w-4 fill-crimson-500" />
          </button>
          <div className="mt-2">
            <p className="truncate text-sm font-semibold text-white">{film!.title}</p>
            <Link
              to={`/film/${film!.slug}`}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold-300 hover:text-gold-200"
            >
              <Play className="h-3 w-3 fill-gold-300" /> Book
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- shared */

function BookingRow({ booking, past }: { booking: Booking; past?: boolean }) {
  const { money } = useLocale()
  const film = filmById(booking.filmId)
  const cinema = cinemaById(booking.cinemaId)
  if (!film || !cinema) return null

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/6 bg-ink-850/60 p-4 sm:flex-row sm:items-center">
      <Link to={`/film/${film.slug}`} className="h-28 w-20 shrink-0 overflow-hidden rounded-xl">
        <Poster film={film} />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">{film.title}</h3>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {booking.format}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {dateLabel(booking.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {booking.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {cinema.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5" />{' '}
            {booking.seats.map((s) => `${s.row}${s.col}`).join(', ')}
          </span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Ref <span className="font-mono text-gold-200">{booking.ref}</span> ·{' '}
          {money(booking.totalGBP)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {past ? (
          <>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/6">
              <Star className="h-3.5 w-3.5 text-gold-300" /> Rate
            </button>
            <Link
              to={`/film/${film.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/12"
            >
              Book again <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </>
        ) : (
          <QrPlaceholder seed={booking.ref} className="hidden h-16 w-16 sm:grid" />
        )}
      </div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Ticket
  title: string
  body: string
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-white/6 bg-ink-850/60 py-20 text-center">
      <Icon className="mb-3 h-10 w-10 text-ink-500" />
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-neutral-400">{body}</p>
      <Link
        to="/browse"
        className="mt-5 rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-5 py-2.5 text-sm font-bold text-ink-950"
      >
        Find a film
      </Link>
    </div>
  )
}

function Preferences() {
  const { likedGenres, lang, currency } = usePreferences()
  const toggleGenre = usePreferences((s) => s.toggleGenre)
  const setLang = usePreferences((s) => s.setLang)
  const setCurrency = usePreferences((s) => s.setCurrency)
  const [notify, setNotify] = useState({ premieres: true, offers: false, reminders: true })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/6 bg-ink-850/60 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Heart className="h-5 w-5 text-crimson-400" /> Favourite genres
        </h3>
        <p className="mt-1 text-sm text-neutral-400">These tune your homepage and recommendations.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {allGenres.map((g) => (
            <Chip key={g} active={likedGenres.includes(g)} onClick={() => toggleGenre(g)}>
              {g}
            </Chip>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/6 bg-ink-850/60 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Bell className="h-5 w-5 text-gold-300" /> Notifications
        </h3>
        <p className="mt-1 text-sm text-neutral-400">Choose what lands in your inbox.</p>
        <div className="mt-4 space-y-1">
          <Toggle label="Premiere & on-sale alerts" on={notify.premieres} onClick={() => setNotify((n) => ({ ...n, premieres: !n.premieres }))} />
          <Toggle label="Member offers & discounts" on={notify.offers} onClick={() => setNotify((n) => ({ ...n, offers: !n.offers }))} />
          <Toggle label="Showtime reminders" on={notify.reminders} onClick={() => setNotify((n) => ({ ...n, reminders: !n.reminders }))} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/6 bg-ink-850/60 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Globe className="h-5 w-5 text-gold-300" /> Region &amp; language
        </h3>
        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Language</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Chip key={l.code} active={lang === l.code} onClick={() => setLang(l.code)}>
              {l.flag} {l.label}
            </Chip>
          ))}
        </div>
        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-neutral-400">Currency</p>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <Chip key={c.code} active={currency === c.code} onClick={() => setCurrency(c.code)}>
              {c.symbol} {c.code}
            </Chip>
          ))}
        </div>
      </section>

      <section className="flex flex-col justify-between rounded-2xl border border-gold-300/20 bg-linear-to-br/srgb from-gold-500/8 to-transparent p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-300/15 text-gold-300">
            <FilmIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold">Lumière Unlimited</h3>
            <p className="text-sm text-neutral-400">Renews 14 Jul 2026 · £18.99/month</p>
          </div>
        </div>
        <Link
          to="/offers"
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/6"
        >
          Manage membership <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/4"
    >
      <span>{label}</span>
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          on ? 'bg-crimson-600' : 'bg-ink-600',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all',
            on ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </span>
    </button>
  )
}

/* ---------------------------------------------------------------- helpers */

function mostFrequent(arr: string[]): string | undefined {
  const m = new Map<string, number>()
  arr.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1))
  let best: string | undefined
  let max = 0
  m.forEach((v, k) => {
    if (v > max) {
      max = v
      best = k
    }
  })
  return best
}

function calendarUrl(
  booking: Booking,
  film: NonNullable<ReturnType<typeof filmById>>,
  location: string,
): string {
  const start = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00`
  const end = new Date(`${booking.date}T${booking.time}:00`)
  end.setMinutes(end.getMinutes() + film.runtime)
  const pad = (n: number) => String(n).padStart(2, '0')
  const endStr = `${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}T${pad(end.getHours())}${pad(end.getMinutes())}00`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${film.title} — Lumière Cinema`,
    dates: `${start}/${endStr}`,
    details: `Seats ${booking.seats.map((s) => `${s.row}${s.col}`).join(', ')} · Ref ${booking.ref}`,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
