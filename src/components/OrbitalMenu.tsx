import { useEffect, useRef, useState } from 'react'
import { NAV_LINKS } from '../data/content'
import { scrollToSection } from '../lib/scroll'
import { useIsDesktop } from '../hooks/useMedia'

const STEP = 360 / NAV_LINKS.length // 72° per section
const RADIUS = 215 // px, label ring
const SIZE = 560 // px, wheel diameter

/**
 * Fixed dial on the right edge, half off-screen. Section labels sit on a
 * ring; the whole wheel rotates with scroll (down = one way, up = the
 * other) so the label of the current section always lands on the marker
 * at the wheel's left. Clicking a label scrolls to that section.
 */
export default function OrbitalMenu() {
  const wheel = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    // The dial is `hidden md:block`; on phones skip the per-frame scroll loop
    // entirely so it isn't reading layout every frame behind a hidden element.
    if (!isDesktop) return
    let raf = 0
    let rot = 180 // current rendered rotation, eased toward target

    const tick = () => {
      const y = window.scrollY + window.innerHeight * 0.4

      // continuous section index: k + fraction toward the next section top
      const tops = NAV_LINKS.map((l) => {
        const el = document.querySelector(l.href)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })
      let v = 0
      for (let i = 0; i < tops.length; i++) {
        if (y >= tops[i]) {
          const next = tops[i + 1] ?? document.documentElement.scrollHeight
          const span = Math.max(1, next - tops[i])
          const frac = Math.min(1, (y - tops[i]) / span)
          // cubic: the label stays locked on the marker for most of the
          // section, then sweeps toward the next one near the boundary
          v = i + frac * frac * frac
        }
      }

      const target = 180 - v * STEP
      rot += (target - rot) * 0.08
      if (wheel.current) wheel.current.style.transform = `rotate(${rot}deg)`

      setActive((prev) => {
        const idx = Math.min(NAV_LINKS.length - 1, Math.round(v))
        return idx === prev ? prev : idx
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isDesktop])

  return (
    <div
      aria-hidden="false"
      className="fixed top-1/2 z-40 hidden -translate-y-1/2 md:block"
      style={{ right: -SIZE / 2, width: SIZE, height: SIZE }}
    >
      {/* marker: fixed, does not rotate */}
      <div className="pointer-events-none absolute top-1/2 left-0 z-10 flex -translate-y-1/2 items-center gap-2">
        <span className="block h-px w-8 bg-electric" />
        <span className="block h-1.5 w-1.5 rounded-full bg-electric" />
      </div>

      {/* rotating wheel */}
      <div ref={wheel} className="absolute inset-0 will-change-transform">
        {/* rings */}
        <div className="absolute inset-0 rounded-full border border-paper/10" />
        <div className="absolute inset-[70px] rounded-full border border-paper/5" />
        {/* tick marks */}
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 block h-px w-2 origin-left bg-paper/15"
            style={{
              transform: `rotate(${i * 10}deg) translateX(${SIZE / 2 - 14}px)`,
            }}
          />
        ))}
        {/* labels on the ring; extra 180° so the active one reads upright */}
        {NAV_LINKS.map((link, i) => (
          <button
            key={link.href}
            onClick={() => scrollToSection(link.href)}
            className={`absolute top-1/2 left-1/2 flex origin-center items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-500 ${
              active === i ? 'text-paper' : 'text-paper/35 hover:text-paper/70'
            }`}
            style={{
              transform: `translate(-50%, -50%) rotate(${i * STEP}deg) translateX(${RADIUS}px) rotate(180deg)`,
            }}
          >
            <span className={active === i ? 'text-electric' : 'text-paper/30'}>0{i + 1}</span>
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}
