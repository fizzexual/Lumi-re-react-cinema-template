import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Volume2,
  Armchair,
  Aperture,
  ArrowRight,
  MapPin,
  Star,
} from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { Container, SectionHeader } from '../components/ui/Section'
import { FilmRail } from '../components/ui/FilmRail'
import { Poster } from '../components/ui/Poster'
import { LogoMarquee } from '../components/ui/Brand'
import { films, filmById } from '../data/films'
import { cinemas } from '../data/cinemas'
import { recommendFromGenres } from '../lib/recommendations'
import { usePreferences } from '../store/usePreferences'
import { useLocale } from '../hooks/useLocale'

const nowShowing = films.filter((f) => f.status === 'now-showing')
const comingSoon = films.filter((f) => f.status === 'coming-soon')

/** Posters used in the membership "fan" collage. */
const posterFan = ['f5', 'f1', 'f9', 'f10', 'f6']

const experiences = [
  {
    icon: Aperture,
    name: 'IMAX',
    blurb: 'Floor-to-ceiling images on the largest screens in the region.',
    tint: 'from-sky-500/20 to-transparent',
  },
  {
    icon: Volume2,
    name: 'Dolby Atmos',
    blurb: 'Sound that moves around and above you with pinpoint precision.',
    tint: 'from-violet-500/20 to-transparent',
  },
  {
    icon: Armchair,
    name: 'Premium Recliners',
    blurb: 'Fully-reclining leather seats with in-seat table service.',
    tint: 'from-gold-500/20 to-transparent',
  },
  {
    icon: Sparkles,
    name: '4DX Motion',
    blurb: 'Motion seats, wind, scent and weather, synced to the film.',
    tint: 'from-crimson-500/20 to-transparent',
  },
]

export default function HomePage() {
  const { t } = useLocale()
  const likedGenres = usePreferences((s) => s.likedGenres)
  const recommended = recommendFromGenres(likedGenres, 8)

  return (
    <>
      <Hero />

      {/* Partner / format marquee */}
      <div className="bg-ink-900/40 py-6">
        <Container>
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Presented in the formats filmmakers intended
          </p>
          <LogoMarquee />
        </Container>
      </div>

      <Container className="space-y-20 py-16">
        {/* Now showing */}
        <section>
          <SectionHeader
            eyebrow={t('label.nowShowing')}
            title="In cinemas this week"
            action={{ label: 'Browse all films', to: '/browse?status=now-showing' }}
          />
          <FilmRail films={nowShowing} />
        </section>

        {/* Recommended */}
        <section>
          <SectionHeader
            eyebrow="Tuned to your taste"
            title={t('label.recommended')}
            action={{ label: 'Refine preferences', to: '/account' }}
          />
          <FilmRail films={recommended} />
        </section>

        {/* Experiences */}
        <section>
          <SectionHeader
            eyebrow="The Lumière difference"
            title="Ways to watch"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-white/6 bg-ink-850 p-6 transition-colors hover:border-white/15"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br/srgb ${exp.tint} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/6 text-gold-300">
                    <exp.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{exp.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {exp.blurb}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <section>
          <SectionHeader
            eyebrow={t('label.comingSoon')}
            title="On the horizon"
            action={{ label: 'See the slate', to: '/browse?status=coming-soon' }}
          />
          <FilmRail films={comingSoon} />
        </section>

        {/* Cinemas teaser */}
        <section>
          <SectionHeader
            eyebrow="Find your local"
            title="Cinemas near you"
            action={{ label: 'All locations', to: '/cinemas' }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cinemas.map((c) => (
              <Link
                key={c.id}
                to="/cinemas"
                className="group relative overflow-hidden rounded-2xl border border-white/6 bg-ink-850 p-5 transition-all hover:-translate-y-1 hover:border-white/15"
              >
                <MapPin className="h-5 w-5 text-gold-300" />
                <h3 className="mt-3 text-base font-bold text-white">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {c.area}, {c.city}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {c.screens} screens · {c.distanceKm} km away
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.formats.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>

      {/* Membership band */}
      <Container>
        <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br/srgb from-ink-800 via-ink-850 to-ink-900 px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="absolute inset-0 bg-linear-to-r/srgb from-crimson-600/10 to-transparent" />
          <div className="relative max-w-xl">
            <p className="eyebrow mb-3">Lumière Unlimited</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              One pass. <span className="text-crimson-500">Every film.</span>{' '}
              Always the best seat.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Unlimited screenings from £18.99/month, priority booking on
              premieres, 10% off food &amp; drink, and free seat upgrades on
              quiet nights.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-6 py-3 text-sm font-bold text-ink-950 shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Join Unlimited <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="flex items-center gap-1.5 text-sm text-slate-300">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Rated 4.8/5 by 12,000 members
              </span>
            </div>
          </div>

          {/* Poster fan */}
          <div className="relative hidden h-64 lg:block">
            {posterFan.map((id, i) => {
              const film = filmById(id)
              if (!film) return null
              const offset = (i - (posterFan.length - 1) / 2)
              return (
                <div
                  key={id}
                  className="absolute left-1/2 top-1/2 h-60 w-40 overflow-hidden rounded-xl border border-white/10 shadow-card transition-transform duration-500 hover:z-20 hover:-translate-y-2"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${offset * 120}px) rotate(${offset * 7}deg)`,
                    zIndex: 10 - Math.abs(offset),
                  }}
                >
                  <Poster film={film} />
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </>
  )
}
