import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { SERVICES } from '../data/content'
import { useIsTouch } from '../hooks/useMedia'

interface Props {
  reduced: boolean
}

export default function Services({ reduced }: Props) {
  const section = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const activeRef = useRef<number | null>(null)
  activeRef.current = active
  const isTouch = useIsTouch()

  // Scrub reveal: rows slide in progressively tied to scroll position
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.fromTo(
        '.services-heading',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.services-heading',
            start: 'top 95%',
            end: 'top 60%',
            scrub: true,
          },
        },
      )
      gsap.utils.toArray<HTMLElement>('.service-row').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top 98%', end: 'top 72%', scrub: true },
          },
        )
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  // Floating preview card chasing the cursor with lerp
  useEffect(() => {
    if (isTouch || reduced) return
    const el = preview.current
    const host = section.current
    if (!el || !host) return

    const mouse = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let raf = 0
    let seeded = false

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!seeded) {
        pos.x = mouse.x
        pos.y = mouse.y
        seeded = true
      }
    }

    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.12
      pos.y += (mouse.y - pos.y) * 0.12
      // only while the cursor is actually inside the section
      const b = host.getBoundingClientRect()
      const inside = mouse.y >= b.top && mouse.y <= b.bottom
      const on = activeRef.current !== null && inside
      el.style.transform = `translate3d(${pos.x + 28}px, ${pos.y - 90}px, 0) scale(${on ? 1 : 0.8})`
      el.style.opacity = on ? '1' : '0'
      raf = requestAnimationFrame(loop)
    }

    host.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      host.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isTouch, reduced])

  return (
    <section id="servicii" ref={section} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="services-heading mb-16 flex flex-col gap-4 md:mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
            Ce facem
          </span>
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-bold leading-tight tracking-tight">
            Servicii construite pe
            <br />
            rezultate, nu pe promisiuni.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-paper/50">
            Pachete gândite pentru startup-uri la început de drum: începi cu ce ai nevoie acum și
            adaugi pe măsură ce afacerea crește.
          </p>
        </div>
      </div>

      <div className="service-list border-t border-paper/10">
        {SERVICES.map((s, i) => (
          <article
            key={s.num}
            className="service-row group relative border-b border-paper/10"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="mx-auto flex max-w-[1600px] flex-col justify-center gap-3 px-6 py-10 md:h-[176px] md:flex-row md:items-center md:gap-10 md:px-12">
              <div className="row-head flex flex-1 items-baseline gap-6 will-change-transform">
                <span className="font-mono text-sm text-electric">{s.num}</span>
                <h3 className="flip-trigger font-display text-[clamp(1.7rem,4vw,3.2rem)] font-bold tracking-tight">
                  <span className="flip">
                    <span>{s.title}</span>
                    <span aria-hidden="true" className="text-electric">
                      {s.title}
                    </span>
                  </span>
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-paper/50 md:text-right">
                {s.desc}
              </p>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30 lg:block lg:w-56 lg:text-right">
                {s.meta}
              </span>
            </div>
            <span className="row-line absolute bottom-0 left-0 h-px w-full bg-electric will-change-transform" />
          </article>
        ))}
      </div>

      {/* cursor-chasing preview card */}
      {!isTouch && (
        <div
          ref={preview}
          className="pointer-events-none fixed top-0 left-0 z-40 h-44 w-64 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 will-change-transform"
          aria-hidden="true"
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
              style={{ background: s.gradient, opacity: active === i ? 1 : 0 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80">
                {s.meta}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
