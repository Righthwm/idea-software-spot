import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../hooks/useMedia'

/**
 * Two-part custom cursor: an 8px dot glued to the pointer and a 40px ring
 * that trails with lerp. Grows on interactive elements; shows a label over
 * elements carrying [data-cursor]. Hidden entirely on touch devices.
 */
export default function Cursor() {
  const isTouch = useIsTouch()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const labelRef = useRef('')

  useEffect(() => {
    if (isTouch) return
    document.documentElement.classList.add('has-custom-cursor')

    const mouse = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let hovering = false
    let visible = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!visible) {
        visible = true
        ring.x = mouse.x
        ring.y = mouse.y
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element
      const labelled = el.closest?.('[data-cursor]')
      const next = labelled?.getAttribute('data-cursor') ?? ''
      if (next !== labelRef.current) {
        labelRef.current = next
        setLabel(next)
      }
      hovering = !!el.closest?.('a, button, [role="button"], input, textarea, select, label, .service-row')
    }

    const onLeaveWindow = () => {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.15
      ring.y += (mouse.y - ring.y) * 0.15
      const el = ringRef.current
      if (el) {
        const hasLabel = labelRef.current !== ''
        const size = hasLabel ? 92 : hovering ? 60 : 40
        el.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
        el.style.width = `${size}px`
        el.style.height = `${size}px`
        el.classList.toggle('cursor-labelled', hasLabel)
        el.classList.toggle('cursor-hover', hovering && !hasLabel)
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      cancelAnimationFrame(raf)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[200] h-2 w-2 rounded-full bg-paper opacity-0 will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[199] flex h-10 w-10 items-center justify-center rounded-full border border-paper/60 opacity-0 transition-[width,height,background-color] duration-300 will-change-transform"
        aria-hidden="true"
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-widest text-void transition-opacity duration-200 ${
            label ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {label}
        </span>
      </div>
      <style>{`
        .cursor-ring.cursor-hover { background: rgba(237,237,242,0.9); mix-blend-mode: difference; border-color: transparent; }
        .cursor-ring.cursor-labelled { background: var(--color-electric); border-color: transparent; }
      `}</style>
    </>
  )
}
