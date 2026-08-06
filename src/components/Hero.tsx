import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

const TITLE = ['Idei', 'care', 'devin', 'rezultate', 'digitale.']

interface Props {
  ready: boolean
  reduced: boolean
}

export default function Hero({ ready, reduced }: Props) {
  const section = useRef<HTMLElement>(null)

  // Entrance: staggered words rising, then subtitle + indicator
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(['.hero-word', '.hero-sub', '.hero-eyebrow', '.hero-indicator'], {
          opacity: 1,
          y: 0,
        })
        return
      }
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(
          '.hero-eyebrow',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        )
        .fromTo(
          '.hero-word',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
          '-=0.3',
        )
        .fromTo(
          '.hero-sub',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.45',
        )
        .fromTo('.hero-indicator', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')
    }, section)
    return () => ctx.revert()
  }, [ready, reduced])

  // Pinned exit: 3D scales down + fades, text parallaxes away at its own speed
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
        },
      })
      tl.to('.hero-copy', { y: -180, ease: 'none' }, 0)
        .to('.hero-bg', { y: -60, ease: 'none' }, 0)
        .to('.hero-indicator', { opacity: 0, ease: 'none' }, 0)
      ScrollTrigger.refresh()
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="acasa"
      ref={section}
      className="relative flex h-svh items-center overflow-hidden"
    >
      {/* background glow layer — slowest parallax layer */}
      <div className="hero-bg absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-electric/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[40vmin] w-[40vmin] rounded-full bg-signal/5 blur-[100px]" />
      </div>

      {/* the particle centerpiece lives in the global ParticleField layer */}
      {reduced && (
        <div
          className="absolute top-1/2 left-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/30 bg-electric/5"
          aria-hidden="true"
        />
      )}

      <div className="hero-copy relative z-10 mx-auto w-full max-w-[1600px] px-6 will-change-transform md:px-12">
        <p className="hero-eyebrow mb-6 font-mono text-xs uppercase tracking-[0.3em] text-paper/50 opacity-0">
          Partener digital pentru startup-uri · România
        </p>
        <h1 className="max-w-3xl font-display text-[clamp(1.9rem,4.2vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight">
          {TITLE.map((word, i) => (
            <span key={i} className="mr-[0.24em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className={`hero-word inline-block opacity-0 will-change-transform ${
                  word === 'rezultate' ? 'text-electric' : ''
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-sub mt-6 max-w-md text-base leading-relaxed text-paper/60 opacity-0 md:text-lg">
          Website-uri premium și campanii care aduc primii clienți. Din 2022 ajutăm startup-uri din
          România să crească, nu doar să existe online.
        </p>
      </div>

      {/* scroll indicator */}
      <div className="hero-indicator absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
          scroll
        </span>
        <span className="scroll-pulse block h-12 w-px bg-paper/60" />
      </div>
    </section>
  )
}
