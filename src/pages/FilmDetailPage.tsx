import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play,
  Ticket,
  Heart,
  Clock,
  Calendar,
  Globe,
  Award,
  Bell,
  ChevronLeft,
} from 'lucide-react'
import { filmBySlug } from '../data/films'
import { usePreferences } from '../store/usePreferences'
import { Poster } from '../components/ui/Poster'
import { FormatLogo } from '../components/ui/Brand'
import { ScoreChip, Stars } from '../components/ui/Rating'
import { CertBadge, Chip } from '../components/ui/Badge'
import { CastPortrait } from '../components/ui/CastPortrait'
import { Container, SectionHeader } from '../components/ui/Section'
import { FilmRail } from '../components/ui/FilmRail'
import { ShowtimesPicker } from '../components/film/ShowtimesPicker'
import { Reviews } from '../components/film/Reviews'
import { backdropBackground } from '../lib/posterArt'
import { recommendFor } from '../lib/recommendations'
import { runtimeLabel, dateLabel, compactNumber } from '../lib/format'
import { cn } from '../lib/cn'

type Tab = 'overview' | 'showtimes' | 'reviews'

export default function FilmDetailPage() {
  const { slug } = useParams()
  const film = slug ? filmBySlug(slug) : undefined
  const [tab, setTab] = useState<Tab>('overview')
  const watchlist = usePreferences((s) => s.watchlist)
  const toggleWatchlist = usePreferences((s) => s.toggleWatchlist)
  const saved = !!film && watchlist.includes(film.id)

  if (!film) {
    return (
      <Container className="grid min-h-[60vh] place-items-center pt-24 text-center">
        <div>
          <h1 className="text-2xl font-bold">Film not found</h1>
          <Link to="/browse" className="mt-4 inline-block text-gold-300 hover:underline">
            ← Back to all films
          </Link>
        </div>
      </Container>
    )
  }

  const similar = recommendFor(film, 8)
  const isComingSoon = film.status === 'coming-soon'

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'showtimes', label: isComingSoon ? 'Release' : 'Showtimes' },
    { key: 'reviews', label: 'Reviews' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="relative">
        <div
          className="absolute inset-0 h-[560px] overflow-hidden"
          style={{ background: backdropBackground(film) }}
        >
          {film.backdropUrl && (
            <img
              src={film.backdropUrl}
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-top"
            />
          )}
        </div>
        <div className="absolute inset-0 h-[560px] bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
        <div className="absolute inset-0 h-[560px] bg-gradient-to-r from-ink-950/80 to-transparent" />

        <Container className="relative pt-24">
          <Link
            to="/browse"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> All films
          </Link>

          <div className="grid gap-8 pb-4 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-48 overflow-hidden rounded-2xl border border-white/10 shadow-card md:mx-0 md:w-full"
            >
              <div className="aspect-[2/3]">
                <Poster film={film} />
              </div>
            </motion.div>

            {/* Headline meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {film.genres.map((g) => (
                  <Link key={g} to={`/browse?genre=${g}`}>
                    <Chip>{g}</Chip>
                  </Link>
                ))}
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl">
                {film.title}
              </h1>
              <p className="mt-3 text-lg italic text-slate-300">“{film.tagline}”</p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <ScoreChip score={film.score} votes={film.votes} />
                <CertBadge cert={film.certificate} />
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold-300" /> {runtimeLabel(film.runtime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold-300" />
                  {dateLabel(film.releaseDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-gold-300" /> {film.languages.join(', ')}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {isComingSoon ? (
                  <button
                    onClick={() => setTab('showtimes')}
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-gold-300 to-gold-500 px-7 py-3.5 text-base font-bold text-ink-950 shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    <Bell className="h-5 w-5" /> Notify me
                  </button>
                ) : (
                  <button
                    onClick={() => setTab('showtimes')}
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-crimson-500 to-crimson-600 px-7 py-3.5 text-base font-bold text-white shadow-glow-crimson transition-transform hover:-translate-y-0.5"
                  >
                    <Ticket className="h-5 w-5" /> Book tickets
                  </button>
                )}
                <button className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.04] px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/[0.1]">
                  <Play className="h-5 w-5 fill-white" /> Trailer
                </button>
                <button
                  onClick={() => toggleWatchlist(film.id)}
                  className={cn(
                    'grid h-[52px] w-[52px] place-items-center rounded-full border transition-all',
                    saved
                      ? 'border-crimson-500/50 bg-crimson-500/15 text-crimson-400'
                      : 'border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.1]',
                  )}
                  aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
                  title={saved ? 'In your watchlist' : 'Add to watchlist'}
                >
                  <Heart className={cn('h-5 w-5', saved && 'fill-crimson-500')} />
                </button>
              </div>

              {film.awards && film.awards.length > 0 && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-300/20 bg-gold-300/[0.06] px-4 py-2 text-sm text-gold-200">
                  <Award className="h-4 w-4" /> {film.awards[0]}
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Tabs */}
      <Container className="mt-8">
        <div className="sticky top-16 z-30 mb-8 flex gap-1 border-b border-white/[0.08] bg-ink-950/70 backdrop-blur-xl">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                'relative px-5 py-3.5 text-sm font-semibold transition-colors',
                tab === tb.key ? 'text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              {tb.label}
              {tab === tb.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold-300"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-10 pb-4 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            {tab === 'overview' && <Overview film={film} />}
            {tab === 'showtimes' &&
              (isComingSoon ? <ReleasePanel film={film} /> : <ShowtimesPicker filmId={film.id} />)}
            {tab === 'reviews' && <Reviews filmId={film.id} fallbackScore={film.score} />}
          </div>

          {/* Sidebar facts */}
          <aside className="space-y-4">
            <FactCard film={film} />
          </aside>
        </div>
      </Container>

      {/* Similar */}
      <Container className="mt-10">
        <SectionHeader eyebrow="If you liked this" title="More like this" />
        <FilmRail films={similar} />
      </Container>
    </>
  )
}

function Overview({ film }: { film: ReturnType<typeof filmBySlug> }) {
  if (!film) return null
  return (
    <div className="space-y-10">
      <section>
        <h3 className="mb-3 text-lg font-bold">Synopsis</h3>
        <p className="max-w-3xl text-[15px] leading-relaxed text-slate-300">
          {film.synopsis}
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-lg font-bold">Top billed cast</h3>
          <span className="text-xs text-neutral-500">{film.cast.length} of full cast</span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {film.cast.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group/cast"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-lg border border-white/[0.06] shadow-card transition-all duration-300 group-hover/cast:-translate-y-1 group-hover/cast:border-white/25">
                <CastPortrait name={c.name} />
              </div>
              <p className="mt-2 truncate text-sm font-bold leading-tight text-white">{c.name}</p>
              <p className="truncate text-xs leading-tight text-neutral-400">as {c.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-bold">Crew</h3>
        <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-2">
          <Fact label="Director" value={film.director} />
          <Fact label="Writers" value={film.writers.join(', ')} />
        </dl>
      </section>
    </div>
  )
}

function ReleasePanel({ film }: { film: ReturnType<typeof filmBySlug> }) {
  if (!film) return null
  const days = Math.max(
    0,
    Math.round((+new Date(film.releaseDate) - Date.now()) / 86_400_000),
  )
  return (
    <div className="overflow-hidden rounded-2xl border border-gold-300/20 bg-ink-850/60 p-8 text-center">
      <p className="eyebrow mb-2">Coming soon</p>
      <h3 className="text-2xl font-bold">In cinemas {dateLabel(film.releaseDate)}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        Tickets aren’t on sale yet. Get notified the moment booking opens for
        your local cinema.
      </p>
      <div className="mt-6 inline-flex items-baseline gap-2 rounded-2xl bg-white/[0.04] px-6 py-4">
        <span className="font-display text-4xl font-extrabold text-gradient-gold">
          {days}
        </span>
        <span className="text-sm text-slate-400">days to go</span>
      </div>
      <div className="mt-6">
        <button className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-gold-300 to-gold-500 px-6 py-3 text-sm font-bold text-ink-950 shadow-glow">
          <Bell className="h-4 w-4" /> Notify me when tickets open
        </button>
      </div>
    </div>
  )
}

function FactCard({ film }: { film: NonNullable<ReturnType<typeof filmBySlug>> }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-ink-850/60 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Details
      </h3>
      <dl className="space-y-3 text-sm">
        <Fact label="Rating" value={`${film.score.toFixed(1)} / 10 · ${compactNumber(film.votes)} votes`} />
        <Fact label="Runtime" value={runtimeLabel(film.runtime)} />
        <Fact label="Release" value={dateLabel(film.releaseDate)} />
        <Fact label="Certificate" value={film.certificate} />
        <Fact label="Languages" value={film.languages.join(', ')} />
        <div>
          <dt className="text-xs text-slate-500">Formats</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {film.formats.map((f) => (
              <FormatLogo key={f} format={f} size="sm" />
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Audience score</dt>
          <dd className="mt-1.5">
            <Stars score={film.score} />
          </dd>
        </div>
      </dl>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-white">{value}</dd>
    </div>
  )
}
