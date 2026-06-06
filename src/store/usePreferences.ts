import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrencyCode, LangCode } from '../lib/i18n'

interface PreferencesState {
  /** Selected home cinema id (defaults to nearest). */
  cinemaId: string
  lang: LangCode
  currency: CurrencyCode
  /** Genres the user has shown affinity for — powers recommendations. */
  likedGenres: string[]
  /** Saved film ids (watchlist). */
  watchlist: string[]
  setCinema: (id: string) => void
  setLang: (lang: LangCode) => void
  setCurrency: (currency: CurrencyCode) => void
  toggleGenre: (genre: string) => void
  toggleWatchlist: (filmId: string) => void
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      cinemaId: 'c1',
      lang: 'en',
      currency: 'GBP',
      likedGenres: ['Sci-Fi', 'Drama'],
      watchlist: ['f3', 'f9', 'f12', 'f6', 'f8'],
      setCinema: (cinemaId) => set({ cinemaId }),
      setLang: (lang) => set({ lang }),
      setCurrency: (currency) => set({ currency }),
      toggleGenre: (genre) =>
        set((s) => ({
          likedGenres: s.likedGenres.includes(genre)
            ? s.likedGenres.filter((g) => g !== genre)
            : [...s.likedGenres, genre],
        })),
      toggleWatchlist: (filmId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(filmId)
            ? s.watchlist.filter((id) => id !== filmId)
            : [filmId, ...s.watchlist],
        })),
    }),
    { name: 'lumiere-prefs' },
  ),
)
