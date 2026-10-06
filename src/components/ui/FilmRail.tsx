import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Film } from '../../data/types'
import { FilmCard } from './FilmCard'
import { cn } from '../../lib/cn'

export function FilmRail({
  films,
  cardWidth = 'w-[320px] sm:w-[380px] lg:w-[420px]',
}: {
  films: Film[]
  cardWidth?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef<number | undefined>(undefined)
  const drag = useRef({
    down: false,
    startX: 0,
    startLeft: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
    vel: 0,
  })
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  const stopInertia = () => {
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = undefined
  }

  useEffect(() => {
    update()
    const el = ref.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      stopInertia()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [films])

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    stopInertia()
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 360), behavior: 'smooth' })
  }

  /* ---- drag-to-scroll with momentum (mouse only; touch = native scroll) ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    stopInertia()
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const st = drag.current
    if (!st.down) return
    const el = ref.current
    if (!el) return
    const dx = e.clientX - st.startX
    if (Math.abs(dx) > 5) st.moved = true
    el.scrollLeft = st.startLeft - dx
    const t = performance.now()
    const dt = t - st.lastT
    if (dt > 0) st.vel = (e.clientX - st.lastX) / dt // pointer velocity px/ms
    st.lastX = e.clientX
    st.lastT = t
  }

  const endDrag = () => {
    const st = drag.current
    if (!st.down) return
    st.down = false
    const el = ref.current
    if (!el) return
    // Fling: continue opposite to pointer velocity, decaying smoothly.
    let sv = Math.max(-44, Math.min(44, -st.vel * 16))
    if (!st.moved || Math.abs(sv) < 0.6) return
    const step = () => {
      const node = ref.current
      if (!node || Math.abs(sv) < 0.4) {
        raf.current = undefined
        return
      }
      node.scrollLeft += sv
      sv *= 0.94
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  // Swallow the click that follows a drag so cards don't navigate mid-fling.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar flex cursor-grab gap-4 overflow-x-auto pb-1 active:cursor-grabbing"
      >
        {films.map((film) => (
          <div key={film.id} className={cn('shrink-0', cardWidth)}>
            <FilmCard film={film} />
          </div>
        ))}
      </div>

      {/* Edge controls — visible whenever the row can scroll that way */}
      {canLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute -left-2 bottom-1 top-0 z-20 hidden w-14 place-items-center bg-linear-to-r/srgb from-ink-950 via-ink-950/80 to-transparent text-white opacity-90 transition-opacity hover:opacity-100 lg:grid"
          aria-label="Scroll left"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-900/80 ring-1 ring-white/15 backdrop-blur-sm">
            <ChevronLeft className="h-6 w-6" />
          </span>
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute -right-2 bottom-1 top-0 z-20 hidden w-14 place-items-center bg-linear-to-l/srgb from-ink-950 via-ink-950/80 to-transparent text-white opacity-90 transition-opacity hover:opacity-100 lg:grid"
          aria-label="Scroll right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-900/80 ring-1 ring-white/15 backdrop-blur-sm">
            <ChevronRight className="h-6 w-6" />
          </span>
        </button>
      )}
    </div>
  )
}
