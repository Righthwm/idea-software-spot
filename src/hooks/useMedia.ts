import { useEffect, useState } from 'react'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsTouch() {
  return useMediaQuery('(pointer: coarse)')
}

/** Matches Tailwind's `md` breakpoint — the orbital menu is desktop-only. */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)')
}

// Static, one-shot read of the device's raw horsepower.
const LOW_CORE = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4
const LOW_MEM =
  typeof navigator !== 'undefined' &&
  ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4

/**
 * True on phones / low-power devices, where two full-screen WebGL layers plus
 * 24k particles overwhelm the GPU. Reactive to viewport + pointer changes so
 * rotating a tablet or docking a laptop re-evaluates. Drives lighter rendering.
 */
export function useLowPower() {
  const coarse = useMediaQuery('(pointer: coarse)')
  const narrow = useMediaQuery('(max-width: 820px)')
  return (coarse && narrow) || LOW_CORE || LOW_MEM
}
