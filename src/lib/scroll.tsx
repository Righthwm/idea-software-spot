import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

export function getLenis() {
  return lenis
}

export function scrollToSection(target: string) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function startScroll() {
  lenis?.start()
  document.documentElement.style.overflow = ''
}

/** Lenis smooth scroll wired into GSAP's ticker + ScrollTrigger. */
export function SmoothScroll({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  useEffect(() => {
    if (!enabled) return

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    if (import.meta.env.DEV) {
      // exposed for dev tooling / preview automation only
      ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    }

    const raf = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])

  return <>{children}</>
}
