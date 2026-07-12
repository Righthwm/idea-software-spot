import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { PROJECTS } from '../data/content'

interface Props {
  reduced: boolean
}

/**
 * Pinned section that converts vertical scroll into horizontal travel
 * through the project cards, with a progress bar tracking the journey.
 */
export default function Portfolio({ reduced }: Props) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const getDistance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth

      gsap.to(track.current, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="proiecte" ref={section} className="relative overflow-hidden bg-void">
      <div className={reduced ? '' : 'flex h-svh flex-col justify-center'}>
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-24 pb-10 md:px-12 md:pt-28">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
            Proiecte selectate
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.8rem)] font-bold tracking-tight">
            Muncă de care suntem mândri.
          </h2>
        </div>

        <div
          ref={track}
          className={`flex gap-6 px-6 will-change-transform md:gap-10 md:px-12 ${
            reduced ? 'flex-col' : 'w-max items-stretch'
          }`}
        >
          {PROJECTS.map((p) => (
            <article
              key={p.name}
              data-cursor="Vezi proiect"
              className={`project-card group relative shrink-0 overflow-hidden rounded-xl ${
                reduced ? 'h-[60vh] w-full' : 'h-[52svh] w-[85vw] md:w-[46vw]'
              }`}
            >
              <div className="card-media absolute inset-0" style={{ background: p.gradient }}>
                {/* subtle texture rings on the "image" */}
                <div className="absolute -right-16 -bottom-24 h-72 w-72 rounded-full border border-paper/15" />
                <div className="absolute -right-4 -bottom-36 h-96 w-96 rounded-full border border-paper/10" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/80">
                    {p.category}
                  </span>
                  <span className="font-mono text-[11px] text-paper/60">{p.result}</span>
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

              {/* hover overlay with CTA */}
              <div className="card-overlay absolute inset-0 flex items-center justify-center bg-void/50 backdrop-blur-[2px]">
                <span className="rounded-full bg-paper px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-void">
                  Vezi proiectul
                </span>
              </div>
            </article>
          ))}

          {/* end card */}
          {!reduced && (
            <div className="flex w-[40vw] shrink-0 items-center justify-center md:w-[28vw]">
              <p className="max-w-[16ch] text-center font-display text-2xl font-bold text-paper/40">
                Următorul proiect poate fi al tău.
              </p>
            </div>
          )}
        </div>

        {/* horizontal progress bar */}
        {!reduced && (
          <div className="mx-auto mt-10 w-full max-w-[1600px] px-6 pb-10 md:px-12">
            <div className="h-px w-full bg-paper/10">
              <div
                ref={bar}
                className="h-full w-full origin-left scale-x-0 bg-electric will-change-transform"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
