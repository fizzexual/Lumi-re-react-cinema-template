import { Link } from 'react-router-dom'
import { Clapperboard, Instagram, Twitter, Youtube, Send } from 'lucide-react'
import { Container } from '../ui/Section'

const columns = [
  {
    title: 'Discover',
    links: [
      { label: 'Now showing', to: '/browse?status=now-showing' },
      { label: 'Coming soon', to: '/browse?status=coming-soon' },
      { label: 'Trending', to: '/browse?sort=trending' },
      { label: 'Documentaries', to: '/browse?genre=Documentary' },
    ],
  },
  {
    title: 'Visit',
    links: [
      { label: 'Our cinemas', to: '/cinemas' },
      { label: 'Accessibility', to: '/cinemas' },
      { label: 'Private hire', to: '/offers' },
      { label: 'Gift cards', to: '/offers' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My bookings', to: '/account' },
      { label: 'Membership', to: '/offers' },
      { label: 'Help centre', to: '/account' },
      { label: 'Sign in', to: '/account' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.07] bg-ink-900/60">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand + newsletter */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-600 text-white">
                <Clapperboard className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold uppercase text-white">
                Lumi<span className="text-crimson-500">è</span>re
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              An independent cinema network for people who still believe the best
              seat in the house is in the dark, together.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex max-w-sm items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4"
            >
              <input
                type="email"
                placeholder="Get showtimes in your inbox"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 transition-transform hover:scale-105"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-400 transition-colors hover:text-gold-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Lumière Cinema. All rights reserved.
          </p>
          <p className="hidden text-xs text-slate-500 md:block">
            Terms · Privacy · Accessibility · Cookies
          </p>
          <div className="flex items-center gap-2">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
