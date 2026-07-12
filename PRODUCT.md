# Idea Software Spot — site de prezentare

**Register:** brand (marketing site — design IS the product)

## Ce este

Site-ul agenției Idea Software Spot S.R.L. (România): vinde website-uri premium
și servicii de marketing digital (Meta/Google/TikTok/Snapchat Ads, SEO) către
startup-uri și IMM-uri care vor creștere măsurabilă.

## Audiență

Fondatori și marketing manageri români. Ajung pe site din reclame sau
recomandări; decizia se ia pe încredere + dovadă de competență tehnică.
Site-ul în sine e demo-ul: dacă experiența impresionează, serviciul e credibil.

## Direcție vizuală

Dark, imersiv, tip "experience site" (referință de gen: studiouri creative
WebGL). Fundal global: shader nebulos colorat + strat de ~24k particule GPU
care își schimbă forma pe secțiune (sferă → nod torus → elice → galaxie →
asterisc-logo) și se destramă/curg în jos între secțiuni, totul legat de scroll.

- **Culori:** void `#0a0a0f`, ink `#10101a`, electric `#4d6bff`,
  electric-deep `#2331f0`, signal `#ff5a2d`, paper `#ededf2` (+ roz `#ff2d7b`
  în gradienți). Dark-only.
- **Fonturi:** Syne (display), Instrument Sans (body), IBM Plex Mono (meta/nav).
- **Motion:** GSAP + ScrollTrigger + Lenis; ease premium
  `cubic-bezier(0.76,0,0.24,1)`; scrub pe scroll; reduced-motion peste tot.
- **Semnătură:** meniu radial rotativ (dial) fix pe dreapta, sincronizat cu
  scroll-ul; showcase de proiecte cu carduri care coboară rotindu-se în 3D.

## Structură

One-page cu 5 ancore: Acasă, Servicii, Proiecte, Despre (+ testimoniale),
Contact. Header fix cu burger → meniu overlay. Cursor custom, preloader,
grain overlay.

## Stack

Vite + React 19 + TypeScript, Tailwind v4 (tokens în `src/index.css` `@theme`),
GSAP/ScrollTrigger/SplitText, Lenis, react-three-fiber + three (shadere custom).
Conținut static în `src/data/content.ts`. Dev: port 5183/5184.
