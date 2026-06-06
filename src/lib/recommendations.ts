import type { Film } from '../data/types'
import { films } from '../data/films'

/**
 * Content-based recommender. Scores films by genre overlap, shared cast/crew,
 * format affinity and aggregate score. Pure and deterministic — easy to later
 * swap for a collaborative-filtering service without touching the UI.
 */
export function recommendFor(film: Film, limit = 6): Film[] {
  return films
    .filter((f) => f.id !== film.id)
    .map((candidate) => {
      const genreOverlap = candidate.genres.filter((g) =>
        film.genres.includes(g),
      ).length
      const sharedPeople =
        candidate.director === film.director ? 1 : 0
      const formatOverlap = candidate.formats.filter((fmt) =>
        film.formats.includes(fmt),
      ).length

      const score =
        genreOverlap * 5 +
        sharedPeople * 4 +
        formatOverlap * 0.5 +
        candidate.score * 0.4

      return { candidate, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.candidate)
}

/**
 * Personalised rail from a set of "liked" genres (e.g. from watch history).
 * Used on the homepage + account dashboard.
 */
export function recommendFromGenres(likedGenres: string[], limit = 8): Film[] {
  if (likedGenres.length === 0) {
    return [...films].sort((a, b) => b.score - a.score).slice(0, limit)
  }
  return films
    .map((film) => {
      const match = film.genres.filter((g) => likedGenres.includes(g)).length
      return { film, score: match * 4 + film.score * 0.5 + (film.trending ? 1 : 0) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.film)
}
