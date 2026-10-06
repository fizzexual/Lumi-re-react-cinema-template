import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Search,
  MapPin,
  ChevronDown,
  Globe,
  User,
  Menu,
  X,
  Check,
  Clapperboard,
} from 'lucide-react'
import { cinemas, cinemaById } from '../../data/cinemas'
import { usePreferences } from '../../store/usePreferences'
import { LANGUAGES, CURRENCIES } from '../../lib/i18n'
import { useLocale } from '../../hooks/useLocale'
import { useClickOutside } from '../../hooks/useClickOutside'
import { SearchOverlay } from './SearchOverlay'
import { cn } from '../../lib/cn'

type Dropdown = 'location' | 'locale' | null

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<Dropdown>(null)
  const { pathname } = useLocation()
  const { t } = useLocale()

  const cinemaId = usePreferences((s) => s.cinemaId)
  const activeCinema = cinemaById(cinemaId)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false)
    setDropdown(null)
  }, [pathname])

  // Keyboard shortcut: ⌘K / Ctrl-K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/browse', label: t('nav.films') },
    { to: '/cinemas', label: t('nav.cinemas') },
    { to: '/offers', label: t('nav.offers') },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-ink-950/85 backdrop-blur-xl'
            : 'bg-linear-to-b/srgb from-ink-950/80 via-ink-950/30 to-transparent',
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4 sm:px-8 lg:px-12 xl:px-[3.75vw] 2xl:px-16">
          {/* Wordmark */}
          <Link to="/" className="group flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br/srgb from-crimson-500 to-crimson-600 text-white shadow-glow-crimson">
              <Clapperboard className="h-5 w-5" />
            </span>
            <span className="hidden font-display text-lg font-extrabold uppercase tracking-tight text-white sm:block">
              Lumi<span className="text-crimson-500">è</span>re
            </span>
          </Link>

          {/* Primary nav */}
          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white/8 text-white'
                      : 'text-slate-300 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Location picker */}
          <LocationPicker
            open={dropdown === 'location'}
            onToggle={() =>
              setDropdown((d) => (d === 'location' ? null : 'location'))
            }
            onClose={() => setDropdown(null)}
            label={activeCinema ? activeCinema.name : 'Choose cinema'}
            sublabel={activeCinema?.city ?? undefined}
          />

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/4 py-2 pl-3 pr-2.5 text-sm text-slate-400 transition-colors hover:border-white/25 hover:text-white sm:flex"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden rounded-sm border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 md:inline">
              ⌘K
            </kbd>
          </button>

          {/* Locale */}
          <LocaleMenu
            open={dropdown === 'locale'}
            onToggle={() => setDropdown((d) => (d === 'locale' ? null : 'locale'))}
            onClose={() => setDropdown(null)}
          />

          {/* Account */}
          <Link
            to="/account"
            className="hidden h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/4 text-slate-300 transition-colors hover:border-white/25 hover:text-white sm:grid"
            aria-label="Account"
          >
            <User className="h-4.5 w-4.5" />
          </Link>

          {/* Mobile toggles */}
          <button
            onClick={() => setSearchOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-300 sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-300 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl lg:hidden">
            <nav className="px-4 py-3 sm:px-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-xl px-4 py-3 text-base font-medium',
                      isActive ? 'bg-white/8 text-white' : 'text-slate-300',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/account"
                className="mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-slate-300"
              >
                <User className="h-5 w-5" /> {t('nav.signin')}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function LocationPicker({
  open,
  onToggle,
  onClose,
  label,
  sublabel,
}: {
  open: boolean
  onToggle: () => void
  onClose: () => void
  label: string
  sublabel?: string
}) {
  const ref = useClickOutside<HTMLDivElement>(onClose, open)
  const setCinema = usePreferences((s) => s.setCinema)
  const cinemaId = usePreferences((s) => s.cinemaId)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 py-2 pl-3 pr-2.5 text-sm transition-colors hover:border-white/25"
      >
        <MapPin className="h-4 w-4 text-gold-300" />
        <span className="hidden max-w-[120px] truncate text-left text-white md:block">
          {label}
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl glass-strong p-2 shadow-card animate-fade-up">
          <p className="px-3 pb-2 pt-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Your local cinemas · {sublabel ?? 'select one'}
          </p>
          {cinemas.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCinema(c.id)
                onClose()
              }}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/6',
                c.id === cinemaId && 'bg-white/5',
              )}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{c.name}</p>
                <p className="truncate text-xs text-slate-400">
                  {c.area}, {c.city} · {c.distanceKm} km
                </p>
              </div>
              {c.id === cinemaId && <Check className="mt-0.5 h-4 w-4 text-gold-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LocaleMenu({
  open,
  onToggle,
  onClose,
}: {
  open: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const ref = useClickOutside<HTMLDivElement>(onClose, open)
  const { lang, currency } = usePreferences()
  const setLang = usePreferences((s) => s.setLang)
  const setCurrency = usePreferences((s) => s.setCurrency)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="hidden h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 text-sm text-slate-300 transition-colors hover:border-white/25 hover:text-white sm:flex"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium uppercase">{lang}</span>
        <span className="text-slate-500">·</span>
        <span className="font-medium">{currency}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-64 rounded-2xl glass-strong p-3 shadow-card animate-fade-up">
          <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Language
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition-colors',
                  lang === l.code
                    ? 'bg-gold-300/15 text-gold-200 ring-1 ring-gold-300/40'
                    : 'text-slate-300 hover:bg-white/6',
                )}
              >
                <span className="text-lg">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>

          <p className="px-1 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Currency
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={cn(
                  'rounded-xl px-2 py-2 text-sm font-semibold transition-colors',
                  currency === c.code
                    ? 'bg-gold-300/15 text-gold-200 ring-1 ring-gold-300/40'
                    : 'text-slate-300 hover:bg-white/6',
                )}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
