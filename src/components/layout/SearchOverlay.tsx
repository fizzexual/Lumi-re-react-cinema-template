import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, TrendingUp, CornerDownLeft } from 'lucide-react'
import { films, allGenres } from '../../data/films'
import { Poster } from '../ui/Poster'
import { ScoreChip } from '../ui/Rating'
import { useLocale } from '../../hooks/useLocale'

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { t } = useLocale()

  useEffect(() => {
    if (open) {
      setQuery('')
      // focus after the enter animation frame
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
      return () => {
        cancelAnimationFrame(id)
        document.body.style.overflow = ''
      }
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return films.filter((f) => f.trending).slice(0, 5)
    return films
      .filter((f) => {
        const haystack = [
          f.title,
          f.tagline,
          f.director,
          ...f.genres,
          ...f.cast.map((c) => c.name),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 7)
  }, [query])

  function go(slug: string) {
    onClose()
    navigate(`/film/${slug}`)
  }

  function submit() {
    onClose()
    navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            className="glass-strong relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl shadow-card"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (results[0]) go(results[0].slug)
                    else submit()
                  }
                }}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent py-4 text-base text-white outline-none placeholder:text-slate-500"
              />
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {!query.trim() && (
                <div className="px-3 pb-2 pt-1.5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Browse by genre
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {allGenres.slice(0, 10).map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          onClose()
                          navigate(`/browse?genre=${encodeURIComponent(g)}`)
                        }}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!query.trim() && (
                <p className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" /> {t('label.trending')}
                </p>
              )}

              {results.map((film) => (
                <button
                  key={film.id}
                  onClick={() => go(film.slug)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[0.06]"
                >
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md">
                    <Poster film={film} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {film.title}{' '}
                      <span className="font-normal text-slate-500">{film.year}</span>
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {film.genres.join(' · ')} · dir. {film.director}
                    </p>
                  </div>
                  <ScoreChip score={film.score} size="sm" />
                </button>
              ))}

              {query.trim() && results.length === 0 && (
                <div className="px-3 py-10 text-center text-sm text-slate-400">
                  No films match “{query}”. Try a genre like{' '}
                  <button
                    className="text-gold-300 underline-offset-2 hover:underline"
                    onClick={() => setQuery(allGenres[0])}
                  >
                    {allGenres[0]}
                  </button>
                  .
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="h-3.5 w-3.5" /> to open · Esc to close
              </span>
              <button
                onClick={submit}
                className="font-semibold text-gold-300 hover:text-gold-200"
              >
                See all results →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
