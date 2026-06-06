import { cn } from '../../lib/cn'

/**
 * Deterministic faux-QR block generated from a seed string. Purely decorative —
 * swap for a real QR library (e.g. qrcode.react) when issuing scannable tickets.
 */
export function QrPlaceholder({
  seed,
  className,
}: {
  seed: string
  className?: string
}) {
  const grid = 11
  // Hash the seed into a deterministic bit pattern.
  let h = 2166136261
  const bits: boolean[] = []
  for (let i = 0; i < grid * grid; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i
    h = Math.imul(h, 16777619)
    bits.push(((h >>> (i % 16)) & 1) === 1)
  }

  return (
    <div
      className={cn(
        'grid place-items-center rounded-xl bg-white p-2',
        className,
      )}
      aria-label="Ticket QR code"
    >
      <svg viewBox={`0 0 ${grid} ${grid}`} className="h-full w-full">
        {bits.map((on, i) => {
          const x = i % grid
          const y = Math.floor(i / grid)
          // Force the three finder squares for a QR-like silhouette.
          const finder =
            (x < 3 && y < 3) ||
            (x > grid - 4 && y < 3) ||
            (x < 3 && y > grid - 4)
          if (!on && !finder) return null
          return <rect key={i} x={x} y={y} width={1} height={1} fill="#06060a" />
        })}
      </svg>
    </div>
  )
}
