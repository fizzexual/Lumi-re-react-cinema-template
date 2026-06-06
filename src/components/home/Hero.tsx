import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Ticket, Info, Clock, Calendar } from 'lucide-react'
import { films } from '../../data/films'
import { backdropBackground } from '../../lib/posterArt'
import { ScoreChip } from '../ui/Rating'
import { CertBadge } from '../ui/Badge'
import { Container } from '../ui/Section'
import { runtimeLabel } from '../../lib/format'
import { useLocale } from '../../hooks/useLocale'

const featured = films.filter((f) => f.trending).slice(0, 4)

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { t } = useLocale()
  const film = featured[index]

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % featured.length), 7000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section
      className="relative h-[88vh] min-h-[620px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Crossfading backdrop (real TMDB still) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={film.id}
          className="absolute inset-0"
          style={{ background: backdropBackground(film) }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {film.backdropUrl && (
            <img
              src={film.backdropUrl}
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-center"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic scrims — strong enough to keep text legible over bright stills */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent" />

      <Container className="relative flex h-full flex-col justify-end pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={film.id}
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-crimson-600/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow-crimson">
                {t('label.trending')}
              </span>
              <span className="text-sm text-slate-300">
                {film.genres.slice(0, 3).join(' · ')}
              </span>
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white text-shadow-lg sm:text-6xl lg:text-7xl">
              {film.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg italic text-slate-300">
              “{film.tagline}”
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <ScoreChip score={film.score} votes={film.votes} />
              <CertBadge cert={film.certificate} />
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold-300" /> {runtimeLabel(film.runtime)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold-300" /> {film.year}
              </span>
            </div>

            <p className="mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-slate-300/90">
              {film.synopsis}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={`/film/${film.slug}`}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-crimson-500 to-crimson-600 px-7 py-3.5 text-base font-bold text-white shadow-glow-crimson transition-transform hover:-translate-y-0.5"
              >
                <Ticket className="h-5 w-5" /> {t('cta.book')}
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.04] px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/[0.1]">
                <Play className="h-5 w-5 fill-white" /> Trailer
              </button>
              <Link
                to={`/film/${film.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-base font-semibold text-slate-300 transition-colors hover:text-white"
              >
                <Info className="h-5 w-5" /> {t('cta.details')}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="mt-10 flex items-center gap-2">
          {featured.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIndex(i)}
              className="group relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all"
              style={{ width: i === index ? 44 : 20 }}
              aria-label={`Show ${f.title}`}
            >
              {i === index && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-gold-300"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused ? 0.4 : 1 }}
                  transition={{ duration: paused ? 0.3 : 7, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}
