import { useEffect, useRef, useState, type FormEvent } from 'react'
import { gsap } from '../lib/gsap'
import { useIsTouch } from '../hooks/useMedia'
import Magnetic from './Magnetic'
import CurveWipe from './CurveWipe'

const TITLE = 'Hai să construim ceva.'

interface Props {
  reduced: boolean
}

export default function Contact({ reduced }: Props) {
  const section = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const isTouch = useIsTouch()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Magnetic letters: each char eases toward a nearby cursor and back
  useEffect(() => {
    if (reduced || isTouch) return
    const host = section.current
    const title = titleRef.current
    if (!host || !title) return

    const chars = Array.from(title.querySelectorAll<HTMLElement>('.magnet-char'))
    const state = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }))
    const mouse = { x: -9999, y: -9999 }
    const RADIUS = 170
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const loop = () => {
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = mouse.x - cx
        const dy = mouse.y - cy
        const dist = Math.hypot(dx, dy)
        const s = state[i]
        if (dist < RADIUS && dist > 0) {
          const pull = (1 - dist / RADIUS) * 16
          s.tx = (dx / dist) * pull
          s.ty = (dy / dist) * pull
        } else {
          s.tx = 0
          s.ty = 0
        }
        s.x += (s.tx - s.x) * 0.12
        s.y += (s.ty - s.y) * 0.12
        el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
      })
      raf = requestAnimationFrame(loop)
    }

    host.addEventListener('mousemove', onMove, { passive: true })
    host.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      host.removeEventListener('mousemove', onMove)
      host.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced, isTouch])

  // Fields surface one at a time as the section scrolls in
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-field, .contact-submit',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 92%',
            end: 'top 55%',
            scrub: true,
          },
          clearProps: 'opacity',
        },
      )
    }, section)
    return () => ctx.revert()
  }, [reduced])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setError(null)
    setSending(true)

    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const payload = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) throw new Error(payload?.error ?? 'Mesajul nu a putut fi trimis.')
      setSent(true)
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Mesajul nu a putut fi trimis. Încearcă din nou.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      ref={section}
      className="relative flex min-h-svh flex-col justify-center py-32"
    >
      <CurveWipe fill="var(--color-void)" />

      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
          Contact
        </span>

        <h2
          ref={titleRef}
          className="mt-8 font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[1.02] tracking-tight"
          aria-label={TITLE}
        >
          {TITLE.split(' ').map((word, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap" aria-hidden="true">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="magnet-char inline-block will-change-transform">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-16 md:grid-cols-[1.2fr_1fr]">
          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="font-display text-3xl font-bold text-electric">Mesaj trimis.</p>
              <p className="max-w-md text-paper/60">
                Mulțumim! Revenim cu un răspuns în maximum 24 de ore lucrătoare.
              </p>
            </div>
          ) : (
            <form className="contact-form flex flex-col gap-10" onSubmit={onSubmit}>
              <label className="contact-field flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                  01 — Cum te numești?
                </span>
                <input
                  type="text"
                  name="nume"
                  required
                  placeholder="Nume și prenume"
                  className="border-b border-paper/20 bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-paper/25 focus:border-electric"
                />
              </label>
              <label className="contact-field flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                  02 — Unde te putem contacta?
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="adresa@companie.ro"
                  className="border-b border-paper/20 bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-paper/25 focus:border-electric"
                />
              </label>
              <label className="contact-field flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                  03 — Despre ce e proiectul?
                </span>
                <textarea
                  name="mesaj"
                  required
                  rows={3}
                  placeholder="Câteva rânduri despre afacerea ta și ce vrei să construim."
                  className="resize-none border-b border-paper/20 bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-paper/25 focus:border-electric"
                />
              </label>

              {/* honeypot: ascuns pentru oameni, completat de boți */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="contact-submit flex flex-col gap-4">
                <Magnetic strength={0.4} className="inline-block self-start">
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-full bg-electric px-10 py-5 font-mono text-xs font-medium uppercase tracking-[0.25em] text-paper transition-colors hover:bg-electric-deep disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? 'Se trimite…' : 'Trimite mesajul'}
                  </button>
                </Magnetic>
                {error && (
                  <p role="alert" className="font-mono text-xs text-[#ff6b5a]">
                    {error}
                  </p>
                )}
              </div>
            </form>
          )}

          <div className="flex flex-col gap-8 font-mono text-sm text-paper/50 md:items-end md:text-right">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-paper/30">Email</p>
              <a href="mailto:ideasoftwarespot@gmail.com" className="text-paper hover:text-electric">
                ideasoftwarespot@gmail.com
              </a>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-paper/30">Telefon</p>
              <a href="tel:+40722213956" className="text-paper hover:text-electric">
                0722 213 956
              </a>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-paper/30">Program</p>
              <p>Luni – Vineri, 09:00 – 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
