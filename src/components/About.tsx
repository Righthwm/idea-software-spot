import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { ABOUT_WORDS, STATS } from '../data/content'

interface Props {
  reduced: boolean
}

export default function About({ reduced }: Props) {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // word-by-word reveal tied to scroll progress
      if (!reduced) {
        gsap.fromTo(
          '.about-word',
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: {
              trigger: '.about-paragraph',
              start: 'top 78%',
              end: 'bottom 45%',
              scrub: true,
            },
          },
        )
        // background label drifts slower than the content (parallax layer)
        gsap.fromTo(
          '.about-ghost',
          { y: 80 },
          {
            y: -80,
            ease: 'none',
            scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }

      // animated counters — count up once when entering the viewport
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach((el) => {
        const target = parseFloat(el.dataset.value ?? '0')
        const decimals = parseInt(el.dataset.decimals ?? '0', 10)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: reduced ? 0 : 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals)
          },
        })
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="despre" ref={section} className="relative overflow-hidden py-32 md:py-44">
      <span
        className="about-ghost pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 font-display text-[22vw] font-extrabold whitespace-nowrap text-paper/[0.03] select-none"
        aria-hidden="true"
      >
        despre noi
      </span>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
          Despre noi
        </span>

        <p className="about-paragraph mt-10 max-w-4xl font-display text-[clamp(1.5rem,3.4vw,2.9rem)] font-semibold leading-[1.35] tracking-tight">
          {ABOUT_WORDS.map((w, i) => (
            <span
              key={i}
              className={`about-word ${w.accent ? 'text-electric' : ''}`}
              style={reduced ? undefined : { opacity: 0.15 }}
            >
              {w.text}{' '}
            </span>
          ))}
        </p>

        <div className="mt-24 grid grid-cols-2 gap-x-8 gap-y-14 border-t border-paper/10 pt-14 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl font-extrabold tracking-tight text-paper md:text-6xl">
                <span
                  className="stat-value tabular-nums"
                  data-value={s.value}
                  data-decimals={s.decimals ?? 0}
                >
                  0
                </span>
                <span className="text-electric">{s.suffix}</span>
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
