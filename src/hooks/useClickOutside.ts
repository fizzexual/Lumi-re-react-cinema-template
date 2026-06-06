import { useEffect, useRef } from 'react'

/** Calls `handler` when a pointer/touch lands outside the returned ref. */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  active = true,
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!active) return
    function onDown(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler()
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') handler()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [handler, active])
  return ref
}
