import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { TESTIMONIALS } from '../data/content'
import CurveWipe from './CurveWipe'

/**
 * Carusel de testimoniale. Citatele se schimbă cu un fade scurt condus de
 * GSAP (nu framer-motion, ca să nu reintroducem o dependință doar pentru
 * atât). Fundalul e semi-transparent, ca particulele să se vadă prin el.
 */
export default function Testimonials() {
  const [active, setActive] = useState(0)
  const quote = useRef<HTMLDivElement>(null)
  const firstRun = useRef(true)

  useEffect(() => {
    // La montare conținutul e deja vizibil; animăm doar schimbările ulterioare.
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const el = quote.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    )
    return () => {
      tween.kill()
    }
  }, [active])

  const item = TESTIMONIALS[active]

  return (
    <section className="relative bg-electric-deep/70 text-paper">
      {/* rgba twin of --color-electric-deep (#2331f0), kept in sync with the section bg */}
      <CurveWipe fill="rgba(35, 49, 240, 0.7)" />

      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 md:px-12 md:py-36">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-paper/60">
          Ce spun clienții
        </span>

        <div ref={quote} className="mt-10 max-w-4xl">
          <blockquote className="font-display text-[clamp(1.4rem,3.2vw,2.6rem)] font-semibold leading-[1.35] tracking-tight">
            „{item.quote}"
          </blockquote>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-lg font-bold">{item.name}</span>
            <span className="text-paper/60">{item.role}</span>
            <span className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper/70">
              {item.project}
            </span>
          </div>
        </div>

        {/* Bara e subțire din motive estetice, dar butonul din jurul ei are
            înălțime reală — altfel ținta de click ar fi de 4px. */}
        <div className="mt-12 flex gap-1" role="tablist" aria-label="Testimoniale">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              role="tab"
              aria-selected={active === i}
              aria-label={`Testimonial ${t.name}`}
              onClick={() => setActive(i)}
              className="group flex h-11 cursor-pointer items-center px-2"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-500 ${
                  active === i
                    ? 'w-12 bg-paper'
                    : 'w-6 bg-paper/30 group-hover:w-8 group-hover:bg-paper/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
