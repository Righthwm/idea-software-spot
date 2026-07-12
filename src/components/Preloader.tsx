import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

interface Props {
  reduced: boolean
  onDone: () => void
}

export default function Preloader({ reduced, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    // Skip the long count if assets were already cached this session
    const revisit = sessionStorage.getItem('iss-visited') === '1'
    sessionStorage.setItem('iss-visited', '1')

    if (reduced) {
      const t = setTimeout(() => done.current(), 250)
      return () => clearTimeout(t)
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const num = root.current!.querySelector('.pl-num')!
      const tl = gsap.timeline({ onComplete: () => done.current() })

      tl.to(counter, {
        v: 100,
        duration: revisit ? 0.5 : 1.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          num.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })
        .to('.pl-bar', { scaleX: 1, duration: revisit ? 0.5 : 1.9, ease: 'power2.inOut' }, 0)
        .to('.pl-ui', { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' })
        .to('.pl-top', { yPercent: -101, duration: 0.85, ease: 'power4.inOut' }, '<0.1')
        .to('.pl-bottom', { yPercent: 101, duration: 0.85, ease: 'power4.inOut' }, '<')
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={root} className="fixed inset-0 z-[999]" aria-hidden="true">
      <div className="pl-top absolute top-0 left-0 h-1/2 w-full bg-void will-change-transform" />
      <div className="pl-bottom absolute bottom-0 left-0 h-1/2 w-full bg-void will-change-transform" />
      <div className="pl-ui absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="font-mono text-paper text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight tabular-nums">
          <span className="pl-num">000</span>
          <span className="text-electric">%</span>
        </div>
        <div className="w-[min(60vw,24rem)] h-px bg-paper/15 overflow-hidden">
          <div className="pl-bar h-full w-full bg-electric origin-left scale-x-0 will-change-transform" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper/40">
          Idea Software Spot
        </p>
      </div>
    </div>
  )
}
