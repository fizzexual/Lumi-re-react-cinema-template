import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Crown, Gift, Users, GraduationCap, CalendarDays } from 'lucide-react'
import { Container, SectionHeader } from '../components/ui/Section'
import { cn } from '../lib/cn'

const plans = [
  {
    name: 'Classic',
    price: '£0',
    cadence: 'pay as you go',
    highlight: false,
    features: [
      'Book any screening',
      'Choose your exact seats',
      'Digital tickets & wallet passes',
      'Earn points on every visit',
    ],
    cta: 'Browse films',
    to: '/browse',
  },
  {
    name: 'Unlimited',
    price: '£18.99',
    cadence: 'per month',
    highlight: true,
    features: [
      'Unlimited standard screenings',
      'Priority booking on premieres',
      '10% off food & drink',
      'Free seat upgrades on quiet nights',
      'Bring a friend free once a month',
    ],
    cta: 'Join Unlimited',
    to: '/account',
  },
  {
    name: 'Unlimited+',
    price: '£26.99',
    cadence: 'per month',
    highlight: false,
    features: [
      'Everything in Unlimited',
      'IMAX, 4DX & Atmos included',
      'Guaranteed premium recliners',
      '20% off food & drink',
      'Members-only previews',
    ],
    cta: 'Go Unlimited+',
    to: '/account',
  },
]

const deals = [
  {
    icon: CalendarDays,
    title: 'Tightwad Tuesdays',
    blurb: 'Every ticket, every screen, just £6.99 all day Tuesday.',
    tint: 'from-sky-500/20',
  },
  {
    icon: GraduationCap,
    title: 'Student 25% off',
    blurb: 'Verify once, save on every booking, every day of the week.',
    tint: 'from-violet-500/20',
  },
  {
    icon: Users,
    title: 'Family bundle',
    blurb: 'Four tickets + two snack packs from £38 at weekend matinees.',
    tint: 'from-emerald-500/20',
  },
  {
    icon: Gift,
    title: 'Gift cards',
    blurb: 'The easiest present for film lovers — any amount, never expires.',
    tint: 'from-gold-500/20',
  },
]

export default function OffersPage() {
  return (
    <Container className="pt-24">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Membership &amp; offers</p>
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          See more for <span className="text-gradient-gold">less</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Whether you visit twice a year or twice a week, there’s a way to watch
          that pays for itself.
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={cn(
              'relative flex flex-col rounded-3xl border p-7',
              plan.highlight
                ? 'border-gold-300/40 bg-gradient-to-b from-gold-500/[0.1] to-ink-850 shadow-glow'
                : 'border-white/[0.06] bg-ink-850/60',
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-gradient-to-b from-gold-300 to-gold-500 px-4 py-1 text-xs font-bold text-ink-950">
                Most popular
              </span>
            )}
            <div className="flex items-center gap-2">
              {plan.highlight && <Crown className="h-5 w-5 text-gold-300" />}
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-extrabold text-white">
                {plan.price}
              </span>
              <span className="text-sm text-slate-400">/ {plan.cadence}</span>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to={plan.to}
              className={cn(
                'mt-7 rounded-full py-3 text-center text-sm font-bold transition-transform hover:-translate-y-0.5',
                plan.highlight
                  ? 'bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 shadow-glow'
                  : 'border border-white/15 text-white hover:bg-white/[0.06]',
              )}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Deals */}
      <div className="mt-20">
        <SectionHeader eyebrow="Everyday value" title="Deals worth a trip" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal) => (
            <div
              key={deal.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-850/60 p-6 transition-colors hover:border-white/15"
            >
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100',
                  deal.tint,
                )}
              />
              <div className="relative">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] text-gold-300">
                  <deal.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-white">{deal.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {deal.blurb}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA band */}
      <div className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-crimson-600/20 via-ink-850 to-gold-500/10 p-10 text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Corporate &amp; private hire
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-slate-300">
          Book a whole screen for a premiere night, a team social, or a
          birthday. Catering and big-screen gaming available.
        </p>
        <button className="mt-6 rounded-md bg-white px-6 py-3 text-sm font-bold text-ink-950 transition-transform hover:-translate-y-0.5">
          Enquire about hire
        </button>
      </div>
    </Container>
  )
}
