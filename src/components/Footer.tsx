import { FOUNDED } from '../data/content'

/** Datele oficiale din Registrul Comerțului — identificarea firmei pe site. */
const LEGAL = [
  { label: 'CUI', value: '46034818' },
  { label: 'Reg. Com.', value: 'J12/2261/2022' },
  { label: 'CAEN', value: '6201 — Activități de realizare a software-ului la comandă' },
]

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-void">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-10 font-mono text-xs uppercase tracking-[0.2em] text-paper/40 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>© {FOUNDED} Idea Software Spot S.R.L.</span>
          <span>Website-uri &amp; marketing digital — România</span>
        </div>

        <div className="flex flex-col gap-2 border-t border-paper/10 pt-6 text-[10px] tracking-[0.18em] text-paper/30 md:flex-row md:flex-wrap md:items-center md:gap-x-8">
          <span>
            Sediu social: Str. Sobarilor 38A, Bl. 7, Sc. B, Et. 3, Ap. 48, Cluj-Napoca, jud. Cluj,
            400270
          </span>
          {LEGAL.map((item) => (
            <span key={item.label}>
              {item.label}: <span className="text-paper/45">{item.value}</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
