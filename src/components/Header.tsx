import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { scrollToSection, startScroll, stopScroll } from '../lib/scroll'
import { NAV_LINKS } from '../data/content'
import Magnetic from './Magnetic'
import { usePrefersReducedMotion } from '../hooks/useMedia'

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstRun = useRef(true)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Drawer: panel slides in from the right over a light veil
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    if (firstRun.current) {
      firstRun.current = false
      if (!open) return
    }

    if (open) {
      stopScroll()
      gsap.set(overlay, { autoAlpha: 1 })
      if (reduced) {
        gsap.set('.menu-backdrop', { opacity: 1 })
        gsap.set('.menu-panel', { xPercent: 0 })
        gsap.set(['.menu-link', '.menu-meta', '.menu-close'], { opacity: 1, y: 0 })
        return
      }
      gsap
        .timeline({ defaults: { overwrite: 'auto' } })
        .fromTo(
          '.menu-backdrop',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          0,
        )
        .fromTo(
          '.menu-panel',
          { xPercent: 100 },
          { xPercent: 0, duration: 0.7, ease: '0.76, 0, 0.24, 1' },
          0,
        )
        .fromTo(
          '.menu-link',
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out' },
          '-=0.3',
        )
        .fromTo(
          ['.menu-meta', '.menu-close'],
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.35',
        )
    } else {
      startScroll()
      if (reduced) {
        gsap.set(overlay, { autoAlpha: 0 })
        return
      }
      gsap
        .timeline({ defaults: { overwrite: 'auto' } })
        .to('.menu-panel', { xPercent: 100, duration: 0.55, ease: '0.76, 0, 0.24, 1' }, 0)
        .to('.menu-backdrop', { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
        .set(overlay, { autoAlpha: 0 })
    }
  }, [open, reduced])

  // Touch gestures: swipe left from the right edge opens, swipe right closes
  useEffect(() => {
    let sx = 0
    let sy = 0
    let tracking = false
    let fromEdge = false

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      sx = t.clientX
      sy = t.clientY
      fromEdge = t.clientX > window.innerWidth - 32
      tracking = open || fromEdge
    }
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return
      tracking = false
      const t = e.changedTouches[0]
      const dx = t.clientX - sx
      const dy = t.clientY - sy
      // horizontal-dominant swipes of at least 60px only
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      if (!open && fromEdge && dx < 0) setOpen(true)
      else if (open && dx > 0) setOpen(false)
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [open])

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    // let the drawer start closing before the scroll kicks in
    setTimeout(() => scrollToSection(href), 150)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-[60] w-full transition-all duration-500 ${
          solid && !open
            ? 'bg-void/70 backdrop-blur-md border-b border-paper/5'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <button
            onClick={() => go('#acasa')}
            className="font-display text-lg font-bold tracking-tight text-paper"
            aria-label="Idea Software Spot — acasă"
          >
            idea<span className="text-electric">*</span>spot
          </button>

          <div className="flex items-center gap-8">
            <button
              onClick={() => go('#contact')}
              className="flip-trigger hidden font-mono text-xs uppercase tracking-[0.2em] text-paper/70 md:block"
            >
              <span className="flip">
                <span>Hai să vorbim</span>
                <span aria-hidden="true" className="text-electric">Hai să vorbim</span>
              </span>
            </button>

            <Magnetic strength={0.3}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="group flex h-11 w-11 flex-col items-center justify-center gap-[7px]"
                aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
                aria-expanded={open}
              >
                <span
                  className={`block h-px w-7 bg-paper transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                    open ? 'translate-y-[4px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-px w-7 bg-paper transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                    open ? '-translate-y-[4px] -rotate-45' : ''
                  }`}
                />
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* drawer overlay: light veil + semi-transparent right panel */}
      <div
        ref={overlayRef}
        className="invisible fixed inset-0 z-[55] opacity-0"
        aria-hidden={!open}
      >
        <div
          className="menu-backdrop absolute inset-0 bg-void/40"
          onClick={() => setOpen(false)}
          role="presentation"
        />

        <aside
          className="menu-panel absolute top-0 right-0 flex h-full w-[min(430px,86vw)] flex-col justify-between border-l border-paper/10 bg-ink/75 px-8 pt-28 pb-8 backdrop-blur-xl md:px-10 md:pt-32"
          role="dialog"
          aria-label="Meniu de navigare"
        >
          {/* desktop close arrow, floating on the panel's left edge */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Închide meniul"
            className="menu-close absolute top-1/2 -left-6 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-ink/90 text-paper transition-all duration-300 hover:scale-110 hover:border-electric hover:text-electric md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3 9h12m0 0-5-5m5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link, i) => (
              <div key={link.href} className="overflow-hidden">
                <button
                  onClick={() => go(link.href)}
                  className="menu-link flip-trigger group flex items-baseline gap-4 text-left"
                >
                  <span className="font-mono text-xs text-electric">0{i + 1}</span>
                  <span className="flip font-display text-[clamp(1.9rem,7vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-paper">
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-electric">{link.label}</span>
                  </span>
                </button>
              </div>
            ))}
          </nav>

          <div className="menu-meta flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">
            <span>Idea Software Spot S.R.L. — România</span>
            <a href="mailto:hello@ideasoftwarespot.ro" className="text-paper/70 hover:text-electric">
              hello@ideasoftwarespot.ro
            </a>
          </div>
        </aside>
      </div>
    </>
  )
}
