import { useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { SmoothScroll, startScroll, stopScroll } from './lib/scroll'
import { usePrefersReducedMotion, useLowPower } from './hooks/useMedia'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import BackgroundFX from './components/BackgroundFX'
import ParticleField from './components/ParticleField'
import OrbitalMenu from './components/OrbitalMenu'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import HelixShowcase from './components/HelixShowcase'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const reduced = usePrefersReducedMotion()
  const lowPower = useLowPower()

  // Lock scrolling while the preloader runs, re-measure triggers after
  useEffect(() => {
    if (!loaded) {
      stopScroll()
    } else {
      startScroll()
      ScrollTrigger.refresh()
    }
  }, [loaded])

  return (
    <SmoothScroll enabled={!reduced}>
      {!loaded && <Preloader reduced={reduced} onDone={() => setLoaded(true)} />}
      <Cursor />
      {/* On phones the fbm shader background is dropped for a cheap static
          gradient; the particle field stays but runs in a lighter mode. */}
      <BackgroundFX reduced={reduced || lowPower} />
      {!reduced && <ParticleField ready={loaded} lowPower={lowPower} />}
      <div className="grain relative z-10">
        <Header />
        <OrbitalMenu />
        <main>
          <Hero ready={loaded} reduced={reduced} />
          <Services reduced={reduced} />
          <HelixShowcase reduced={reduced} />
          <About reduced={reduced} />
          <Testimonials />
          <Contact reduced={reduced} />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
