import { useEffect, useState } from 'react'

/** Animates a number from 0 → value once, on mount (eased, finite). */
export function CountUp({
  value,
  duration = 1100,
  suffix = '',
  className,
}: {
  value: number
  duration?: number
  suffix?: string
  className?: string
}) {
  const [n, setN] = useState(0)

  useEffect(() => {
    let raf = 0
    let start: number | undefined
    const tick = (t: number) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return (
    <span className={className}>
      {n}
      {suffix}
    </span>
  )
}
