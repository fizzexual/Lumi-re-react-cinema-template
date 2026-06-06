import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  Film as FilmIcon,
  ChevronDown,
} from 'lucide-react'
import { films, allGenres, allFormats, allLanguages } from '../data/films'
import type { Certificate, Film, Format, Genre } from '../data/types'
import { Container, SectionHeader } from '../components/ui/Section'
import { FilmCard } from '../components/ui/FilmCard'
import { FilmRail } from '../components/ui/FilmRail'
import { Chip } from '../components/ui/Badge'
import { cn } from '../lib/cn'
import { pluralize } from '../lib/format'

type SortKey = 'trending' | 'score' | 'release' | 'title' | 'runtime'
type StatusFilter = 'all' | 'now-showing' | 'coming-soon'

const certs: Certificate[] = ['U', 'PG', '12A', '15', '18']
const sorts: { key: SortKey; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'score', label: 'Top rated' },
  { key: 'release', label: 'Release date' },
  { key: 'title', label: 'A–Z' },
  { key: 'runtime', label: 'Runtime' },
]

export default function BrowsePage() {
  const [params, setParams] = useSearchParams()

  const [query, setQuery] = useState(params.get('q') ?? '')
  const [status, setStatus] = useState<StatusFilter>(
    (params.get('status') as StatusFilter) || 'all',
  )
  const [genres, setGenres] = useState<Genre[]>(
    params.get('genre') ? [params.get('genre') as Genre] : [],
  )
  const [formats, setFormats] = useState<Format[]>([])
  const [certsSel, setCertsSel] = useState<Certificate[]>([])
  const [language, setLanguage] = useState<string>('')
  const [minScore, setMinScore] = useState(0)
  const [sort, setSort] = useState<SortKey>(
    (params.get('sort') as SortKey) || 'trending',
  )
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Keep shareable params (q/status/sort/genre) in sync with the URL.
  useEffect(() => {
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    if (status !== 'all') next.set('status', status)
    if (sort !== 'trending') next.set('sort', sort)
    if (genres.length === 1) next.set('genre', genres[0])
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, sort, genres])

  const toggle = <T,>(arr: T[], set: (v: T[]) => void, value: T) =>
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])

  const activeCount =
    genres.length +
    formats.length +
    certsSel.length +
    (language ? 1 : 0) +
    (minScore > 0 ? 1 : 0) +
    (status !== 'all' ? 1 : 0)

  const isFiltering = activeCount > 0 || query.trim().length > 0

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = films.filter((f) => {
      if (status !== 'all' && f.status !== status) return false
      if (genres.length && !genres.some((g) => f.genres.includes(g))) return false
      if (formats.length && !formats.some((fm) => f.formats.includes(fm))) return false
      if (certsSel.length && !certsSel.includes(f.certificate)) return false
      if (language && !f.languages.includes(language)) return false
      if (f.score < minScore) return false
      if (q) {
        const hay = [
          f.title,
          f.tagline,
          f.director,
          ...f.genres,
          ...f.cast.map((c) => c.name),
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return sortFilms(list, sort)
  }, [query, status, genres, formats, certsSel, language, minScore, sort])

  function resetAll() {
    setQuery('')
    setStatus('all')
    setGenres([])
    setFormats([])
    setCertsSel([])
    setLanguage('')
    setMinScore(0)
    setSort('trending')
  }

  return (
    <Container className="pt-24">
      {/* Heading */}
      <div className="mb-6">
        <p className="eyebrow mb-2">Discover</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Browse films</h1>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-2 mb-6 flex flex-col gap-3 rounded-xl bg-ink-950/80 px-2 py-3 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, director, cast or genre…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear">
              <X className="h-4 w-4 text-neutral-400 hover:text-white" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status quick pills */}
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
            {(['all', 'now-showing', 'coming-soon'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  status === s ? 'bg-white text-ink-950' : 'text-neutral-300 hover:text-white',
                )}
              >
                {s === 'all' ? 'All' : s === 'now-showing' ? 'Now showing' : 'Coming soon'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors',
              filtersOpen || activeCount > 0
                ? 'border-white/30 bg-white/[0.08] text-white'
                : 'border-white/10 bg-white/[0.04] text-neutral-300 hover:text-white',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-crimson-600 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', filtersOpen && 'rotate-180')} />
          </button>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
            <span className="pl-2 text-xs text-neutral-400">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cursor-pointer rounded-full bg-transparent py-1.5 pr-2 text-sm font-medium text-white outline-none [&>option]:bg-ink-800"
            >
              {sorts.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expandable filter panel (full width — no sidebar) */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-850/60"
        >
          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            <FilterGroup label="Genre">
              <div className="flex flex-wrap gap-2">
                {allGenres.map((g) => (
                  <Chip key={g} active={genres.includes(g)} onClick={() => toggle(genres, setGenres, g)}>
                    {g}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Experience">
              <div className="flex flex-wrap gap-2">
                {allFormats.map((f) => (
                  <Chip key={f} active={formats.includes(f)} onClick={() => toggle(formats, setFormats, f)}>
                    {f}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Certificate & language">
              <div className="flex flex-wrap gap-2">
                {certs.map((c) => (
                  <Chip key={c} active={certsSel.includes(c)} onClick={() => toggle(certsSel, setCertsSel, c)}>
                    {c}
                  </Chip>
                ))}
                {allLanguages.map((l) => (
                  <Chip key={l} active={language === l} onClick={() => setLanguage(language === l ? '' : l)}>
                    {l}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label={`Minimum rating · ${minScore.toFixed(1)}+`}>
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                <input
                  type="range"
                  min={0}
                  max={9}
                  step={0.5}
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-600 accent-crimson-500"
                />
              </div>
              {activeCount > 0 && (
                <button
                  onClick={resetAll}
                  className="mt-4 text-xs font-semibold text-crimson-400 hover:text-crimson-500"
                >
                  Reset all filters ({activeCount})
                </button>
              )}
            </FilterGroup>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {isFiltering ? (
        <FilteredResults results={results} onReset={resetAll} />
      ) : (
        <CatalogueRows />
      )}
    </Container>
  )
}

/** Default view: Netflix-style horizontal rows. */
function CatalogueRows() {
  const trending = films.filter((f) => f.trending)
  const nowShowing = films.filter((f) => f.status === 'now-showing')
  const comingSoon = films.filter((f) => f.status === 'coming-soon')

  const genreRows = allGenres
    .map((g) => ({ genre: g, list: films.filter((f) => f.genres.includes(g)) }))
    .filter((r) => r.list.length >= 2)

  return (
    <div className="space-y-12 pb-4">
      <Row title="Trending now" films={trending} />
      <Row title="Now showing" films={nowShowing} />
      <Row title="Coming soon" films={comingSoon} />
      {genreRows.map((r) => (
        <Row key={r.genre} title={r.genre} films={r.list} />
      ))}
    </div>
  )
}

function Row({ title, films }: { title: string; films: Film[] }) {
  if (films.length === 0) return null
  return (
    <section>
      <SectionHeader title={title} />
      <FilmRail films={films} />
    </section>
  )
}

/** Filtered/search view: responsive grid of landscape cards (no sidebar). */
function FilteredResults({
  results,
  onReset,
}: {
  results: Film[]
  onReset: () => void
}) {
  if (results.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-white/[0.06] bg-ink-850/60 py-24 text-center">
        <FilmIcon className="mb-3 h-10 w-10 text-ink-500" />
        <p className="text-lg font-semibold text-white">No films match those filters</p>
        <p className="mt-1 text-sm text-neutral-400">Try loosening a filter or two.</p>
        <button
          onClick={onReset}
          className="mt-5 rounded-md bg-white px-5 py-2 text-sm font-semibold text-ink-950 hover:bg-neutral-200"
        >
          Clear all filters
        </button>
      </div>
    )
  }
  return (
    <div>
      <p className="mb-4 text-sm text-neutral-400">{pluralize(results.length, 'film')} found</p>
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        {results.map((film) => (
          <motion.div
            key={film.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FilmCard film={film} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </h3>
      {children}
    </div>
  )
}

function sortFilms(list: Film[], sort: SortKey): Film[] {
  const copy = [...list]
  switch (sort) {
    case 'score':
      return copy.sort((a, b) => b.score - a.score)
    case 'release':
      return copy.sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate))
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case 'runtime':
      return copy.sort((a, b) => a.runtime - b.runtime)
    case 'trending':
    default:
      return copy.sort(
        (a, b) =>
          Number(b.trending ?? false) - Number(a.trending ?? false) || b.score - a.score,
      )
  }
}
