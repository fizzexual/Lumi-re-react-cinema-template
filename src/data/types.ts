export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Animation'
  | 'Comedy'
  | 'Crime'
  | 'Documentary'
  | 'Drama'
  | 'Fantasy'
  | 'History'
  | 'Horror'
  | 'Mystery'
  | 'Romance'
  | 'Sci-Fi'
  | 'Thriller'

export type Format = 'Standard' | 'IMAX' | 'Dolby Atmos' | '4DX' | '35mm' | 'Premium'

export type Certificate = 'U' | 'PG' | '12A' | '15' | '18'

export type FilmStatus = 'now-showing' | 'coming-soon'

export interface CastMember {
  name: string
  role: string
}

export interface Review {
  id: string
  author: string
  /** 0–10 */
  rating: number
  date: string
  title: string
  body: string
  likes: number
  /** Threaded replies for discussion. */
  replies?: { author: string; body: string; date: string }[]
}

export interface Film {
  id: string
  slug: string
  title: string
  tagline: string
  year: number
  /** Minutes */
  runtime: number
  genres: Genre[]
  certificate: Certificate
  /** Critic/audience aggregate, 0–10 */
  score: number
  /** Count of ratings, for credibility display */
  votes: number
  synopsis: string
  director: string
  writers: string[]
  cast: CastMember[]
  formats: Format[]
  languages: string[]
  releaseDate: string
  status: FilmStatus
  /** Real portrait poster (TMDB). Falls back to procedural art if absent. */
  posterUrl?: string
  /** Real landscape backdrop/still (TMDB). */
  backdropUrl?: string
  /** Two-stop gradient used to generate cohesive key art (fallback). */
  palette: [string, string]
  /** Accent used for glows / UI tint on the detail page. */
  accent: string
  trending?: boolean
  awards?: string[]
}

export interface Cinema {
  id: string
  name: string
  city: string
  area: string
  address: string
  /** Travel hint shown in the location picker. */
  distanceKm: number
  amenities: string[]
  screens: number
  formats: Format[]
  lat: number
  lng: number
}

export interface Showtime {
  id: string
  filmId: string
  cinemaId: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  /** HH:mm 24h */
  time: string
  format: Format
  /** Per-seat base price in the platform's base currency (GBP). */
  basePrice: number
  /** Fraction of seats already sold, 0–1 (drives the live availability bar). */
  soldFraction: number
}

export type TicketTier = 'adult' | 'child' | 'senior' | 'student'

export interface SeatTier {
  /** Row letters belonging to this tier. */
  rows: string[]
  label: string
  /** Multiplier applied to the showtime base price. */
  multiplier: number
}
