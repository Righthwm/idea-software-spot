import { useRef, type ReactNode, type MouseEvent } from 'react'
import { gsap } from '../lib/gsap'
import { useIsTouch, usePrefersReducedMotion } from '../hooks/useMedia'

interface Props {
  children: ReactNode
  strength?: number
  className?: string
}

/** Wrapper that pulls its content toward the cursor and snaps back elastically. */
export default function Magnetic({ children, strength = 0.35, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const reduced = usePrefersReducedMotion()
  const inert = isTouch || reduced

  const onMove = (e: MouseEvent) => {
    if (inert || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    gsap.to(ref.current, { x, y, duration: 0.4, ease: 'power3.out' })
  }

  const onLeave = () => {
    if (inert || !ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
  }

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}
