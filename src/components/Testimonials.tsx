import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TESTIMONIALS } from '../data/content'
import CurveWipe from './CurveWipe'

const EASE = [0.76, 0, 0.24, 1] as const

export default function Testimonials() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 1])
  const t = TESTIMONIALS[index]

  const paginate = (dir: number) => {
    setIndex(([i]) => [(i + dir + TESTIMONIALS.length) % TESTIMONIALS.length, dir])
  }

  return (
    <section className="relative bg-electric-deep/70 text-paper">
      {/* rgba twin of --color-electric-deep (#2331f0), kept in sync with the section bg */}
      <CurveWipe fill="rgba(35, 49, 240, 0.7)" />

      <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 md:py-40">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-paper/60">
          Ce spun clienții
        </span>

        <div className="relative mt-14 min-h-[22rem] md:min-h-[18rem]" data-cursor="Trage">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={index}
              custom={direction}
              initial={{ opacity: 0, scale: 0.96, x: direction * 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: direction * -60 }}
              transition={{ duration: 0.55, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) paginate(1)
                else if (info.offset.x > 70) paginate(-1)
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <blockquote className="max-w-4xl font-display text-[clamp(1.5rem,3.5vw,2.8rem)] font-semibold leading-[1.3] tracking-tight select-none">
                „{t.quote}"
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 font-display text-sm font-bold">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="font-mono text-xs text-paper/60">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* position indicators */}
        <div className="mt-12 flex items-center gap-3">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(([cur]) => [i, i > cur ? 1 : -1])}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                i === index ? 'w-10 bg-paper' : 'w-2 bg-paper/30 hover:bg-paper/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
