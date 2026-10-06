import { Link } from 'react-router-dom'
import { Clapperboard, Home, Search } from 'lucide-react'
import { Container } from '../components/ui/Section'

export default function NotFoundPage() {
  return (
    <Container className="grid min-h-[80vh] place-items-center pt-24 text-center">
      <div>
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-linear-to-br/srgb from-gold-300 to-gold-500 text-ink-950 shadow-glow">
          <Clapperboard className="h-10 w-10" />
        </span>
        <p className="mt-8 font-display text-7xl font-extrabold text-gradient-soft">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold">This reel ran out</h1>
        <p className="mx-auto mt-2 max-w-sm text-slate-400">
          The page you’re after has left the building. Let’s get you back to the
          good stuff.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-6 py-3 text-sm font-bold text-ink-950 shadow-glow"
          >
            <Home className="h-4 w-4" /> Back home
          </Link>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/6"
          >
            <Search className="h-4 w-4" /> Browse films
          </Link>
        </div>
      </div>
    </Container>
  )
}
