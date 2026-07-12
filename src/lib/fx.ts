/**
 * Shared mutable state between the scroll world (GSAP/Lenis) and the
 * WebGL background shader. Written by scroll handlers, read per-frame
 * by BackgroundFX — no React re-renders involved.
 */
export const fxState = {
  /** 0..1 — overall document scroll progress */
  progress: 0,
  /** 0..1 — smoothed scroll velocity, boosts shader glow while moving */
  velocity: 0,
  /** 0..1 — how deep we are inside the showcase pin (peaks mid-way) */
  showcase: 0,
}
