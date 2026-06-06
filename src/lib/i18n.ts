/**
 * Lightweight i18n + currency layer. Intentionally dependency-free so the
 * template stays small; swap for react-intl/i18next when scaling to many locales.
 */

export type LangCode = 'en' | 'es' | 'fr'
export type CurrencyCode = 'GBP' | 'EUR' | 'USD'

export const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

export const CURRENCIES: {
  code: CurrencyCode
  symbol: string
  /** Conversion from the GBP base price. */
  rate: number
  locale: string
}[] = [
  { code: 'GBP', symbol: '£', rate: 1, locale: 'en-GB' },
  { code: 'EUR', symbol: '€', rate: 1.17, locale: 'de-DE' },
  { code: 'USD', symbol: '$', rate: 1.27, locale: 'en-US' },
]

type Dict = Record<string, string>

const en: Dict = {
  'nav.home': 'Home',
  'nav.films': 'Films',
  'nav.cinemas': 'Cinemas',
  'nav.offers': 'Offers',
  'nav.signin': 'Sign in',
  'cta.book': 'Book tickets',
  'cta.bookNow': 'Book now',
  'cta.details': 'View film',
  'cta.showtimes': 'Showtimes',
  'cta.continue': 'Continue',
  'cta.checkout': 'Checkout',
  'label.nowShowing': 'Now showing',
  'label.comingSoon': 'Coming soon',
  'label.trending': 'Trending this week',
  'label.recommended': 'Recommended for you',
  'search.placeholder': 'Search films, cast, genres…',
  'seats.legend.available': 'Available',
  'seats.legend.selected': 'Selected',
  'seats.legend.taken': 'Taken',
  'seats.screen': 'Screen this way',
}

const es: Dict = {
  'nav.home': 'Inicio',
  'nav.films': 'Películas',
  'nav.cinemas': 'Cines',
  'nav.offers': 'Ofertas',
  'nav.signin': 'Entrar',
  'cta.book': 'Comprar entradas',
  'cta.bookNow': 'Reservar',
  'cta.details': 'Ver película',
  'cta.showtimes': 'Horarios',
  'cta.continue': 'Continuar',
  'cta.checkout': 'Pagar',
  'label.nowShowing': 'En cartelera',
  'label.comingSoon': 'Próximamente',
  'label.trending': 'Tendencia esta semana',
  'label.recommended': 'Recomendado para ti',
  'search.placeholder': 'Busca películas, reparto, géneros…',
  'seats.legend.available': 'Disponible',
  'seats.legend.selected': 'Seleccionado',
  'seats.legend.taken': 'Ocupado',
  'seats.screen': 'Pantalla',
}

const fr: Dict = {
  'nav.home': 'Accueil',
  'nav.films': 'Films',
  'nav.cinemas': 'Cinémas',
  'nav.offers': 'Offres',
  'nav.signin': 'Connexion',
  'cta.book': 'Réserver',
  'cta.bookNow': 'Réserver',
  'cta.details': 'Voir le film',
  'cta.showtimes': 'Séances',
  'cta.continue': 'Continuer',
  'cta.checkout': 'Paiement',
  'label.nowShowing': "À l'affiche",
  'label.comingSoon': 'Prochainement',
  'label.trending': 'Tendance cette semaine',
  'label.recommended': 'Recommandé pour vous',
  'search.placeholder': 'Rechercher films, acteurs, genres…',
  'seats.legend.available': 'Disponible',
  'seats.legend.selected': 'Sélectionné',
  'seats.legend.taken': 'Occupé',
  'seats.screen': 'Écran',
}

const dictionaries: Record<LangCode, Dict> = { en, es, fr }

export function translate(lang: LangCode, key: string): string {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key
}

export function formatMoney(baseGBP: number, currency: CurrencyCode): string {
  const c = CURRENCIES.find((x) => x.code === currency)!
  const value = baseGBP * c.rate
  return new Intl.NumberFormat(c.locale, {
    style: 'currency',
    currency: c.code,
    minimumFractionDigits: 2,
  }).format(value)
}
