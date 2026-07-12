import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/useMedia'

// Same command structure so GSAP can tween between them
const D_BLOB =
  'M0,320 C180,120 420,40 720,110 C1020,180 1260,60 1440,170 L1440,320 L0,320 Z'
const D_FLAT =
  'M0,320 C180,316 420,314 720,316 C1020,318 1260,315 1440,318 L1440,320 L0,320 Z'

/**
 * Organic SVG wipe: a blob-shaped leading edge that flattens as the next
 * section's background color sweeps up over the previous one.
 */
export default function CurveWipe({ fill }: { fill: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const path = svg.current?.querySelector('path')
    if (!path) return
    const tween = gsap.fromTo(
      path,
      { attr: { d: D_BLOB } },
      {
        attr: { d: D_FLAT },
        ease: 'none',
        scrollTrigger: { trigger: svg.current, start: 'top 95%', end: 'top 25%', scrub: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced])

  return (
    <svg
      ref={svg}
      className="pointer-events-none absolute bottom-full left-0 -mb-px h-[18vh] w-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={reduced ? D_FLAT : D_BLOB} fill={fill} />
    </svg>
  )
}
