import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { PROJECTS } from '../data/content'
import { fxState } from '../lib/fx'

interface Props {
  reduced: boolean
}

const N = PROJECTS.length

/**
 * Pinned showcase: each project card falls from above, pauses centered,
 * then keeps descending — spinning around the vertical axis and swaying
 * sideways on the way, like beads on a descending helix. The section
 * also feeds the shader background so colors flare while you're inside.
 */
export default function HelixShowcase({ reduced }: Props) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.helix-card')

      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${N * window.innerHeight * 1.1}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            const vw = window.innerWidth
            const vh = window.innerHeight
            const pAll = p * N

            cards.forEach((card, i) => {
              // t = 0 -> card centered; negative above, positive below
              const t = pAll - i - 0.5
              const at = Math.abs(t)
              if (at > 1.4) {
                card.style.visibility = 'hidden'
                return
              }
              card.style.visibility = 'visible'

              const dir = i % 2 === 0 ? 1 : -1
              const y = t * vh * 1.1
              const x = Math.sin(t * Math.PI) * vw * 0.2 * dir
              const z = -at * 520
              const ry = t * 110 * dir
              const rz = t * 14 * dir
              const s = 1 - at * 0.18
              const o = Math.min(1, Math.max(0, 1.2 - at * 1.2))

              card.style.transform =
                `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), ${z.toFixed(0)}px) ` +
                `rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(3)})`
              card.style.opacity = o.toFixed(3)
              card.style.zIndex = String(100 - Math.round(at * 50))
            })

            // shader boost peaks mid-showcase, fades at the edges
            fxState.showcase = Math.sin(p * Math.PI)

            if (counter.current) {
              const idx = Math.min(N - 1, Math.max(0, Math.round(pAll - 0.5)))
              counter.current.textContent = `0${idx + 1} / 0${N}`
            }
          },
          onLeave: () => {
            fxState.showcase = 0
          },
          onLeaveBack: () => {
            fxState.showcase = 0
          },
        },
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="proiecte" ref={section} className="relative overflow-hidden">
      {reduced ? (
        <div className="mx-auto w-full max-w-[1600px] px-6 py-28 md:px-12">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
            Proiecte selectate
          </span>
          <h2 className="mt-4 mb-12 font-display text-[clamp(2rem,4.5vw,3.8rem)] font-bold tracking-tight">
            Muncă de care suntem mândri.
          </h2>
          <div className="flex flex-col gap-8">
            {PROJECTS.map((p) => (
              <ShowcaseCard key={p.name} project={p} className="h-[60vh] w-full" />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative h-svh">
          {/* pinned heading */}
          <div className="pointer-events-none absolute top-0 left-0 z-[110] w-full">
            <div className="mx-auto max-w-[1600px] px-6 pt-24 md:px-12 md:pt-28">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
                Proiecte selectate
              </span>
              <h2 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,3rem)] font-bold tracking-tight">
                Muncă de care suntem mândri.
              </h2>
            </div>
          </div>

          {/* 3D stage */}
          <div
            ref={stage}
            className="absolute inset-0"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {PROJECTS.map((p) => (
              <div
                key={p.name}
                className="helix-card absolute top-1/2 left-1/2 will-change-transform"
                style={{ visibility: 'hidden', opacity: 0 }}
              >
                <ShowcaseCard
                  project={p}
                  className="h-[min(58svh,560px)] w-[min(85vw,520px)]"
                />
              </div>
            ))}
          </div>

          {/* counter */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-[110] w-full">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 pb-10 md:px-12">
              <span ref={counter} className="font-mono text-xs tracking-[0.25em] text-paper/60">
                01 / 0{N}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
                Scroll — proiectele coboară
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function ShowcaseCard({
  project: p,
  className,
}: {
  project: (typeof PROJECTS)[number]
  className: string
}) {
  return (
    <article
      data-cursor="Vezi proiect"
      className={`project-card group relative overflow-hidden rounded-2xl border border-paper/10 ${className}`}
    >
      <div className="card-media absolute inset-0" style={{ background: p.gradient }}>
        <div className="absolute -right-16 -bottom-24 h-72 w-72 rounded-full border border-paper/15" />
        <div className="absolute -right-4 -bottom-36 h-96 w-96 rounded-full border border-paper/10" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/80">
            {p.category}
          </span>
          <span className="text-right font-mono text-[11px] text-paper/60">{p.result}</span>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
            {p.name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-paper/25 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card-overlay absolute inset-0 flex items-center justify-center bg-void/50 backdrop-blur-[2px]">
        <span className="rounded-full bg-paper px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-void">
          Vezi proiectul
        </span>
      </div>
    </article>
  )
}
