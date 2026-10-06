import { cn } from '../../lib/cn'

const GRADIENTS = [
  'from-rose-500 to-orange-400',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-400',
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-rose-500',
  'from-cyan-500 to-blue-500',
]

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function hashIndex(seed: string, mod: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(h) % mod
}

export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const grad = GRADIENTS[hashIndex(name, GRADIENTS.length)]
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  }
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-linear-to-br/srgb font-bold text-white ring-1 ring-white/10',
        grad,
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
