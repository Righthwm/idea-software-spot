/** Anul înființării firmei — Reg. Com. J12/2261/2022, înregistrată 29 aprilie 2022. */
export const FOUNDED = 2022

export const NAV_LINKS = [
  { label: 'Acasă', href: '#acasa' },
  { label: 'Servicii', href: '#servicii' },
  { label: 'Proiecte', href: '#proiecte' },
  { label: 'Despre', href: '#despre' },
  { label: 'Contact', href: '#contact' },
]

export interface Service {
  num: string
  title: string
  desc: string
  meta: string
  gradient: string
}

export const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Website-uri',
    desc: 'Site-uri de prezentare și magazine online construite să convertească, nu doar să arate bine.',
    meta: 'Design · Dezvoltare · CRO',
    gradient: 'linear-gradient(135deg, #4d6bff 0%, #1a1a3e 60%, #0a0a0f 100%)',
  },
  {
    num: '02',
    title: 'Marketing Digital',
    desc: 'Strategie completă de creștere: canale, mesaje, bugete și obiective clare, măsurate lunar.',
    meta: 'Strategie · Funnel · Analytics',
    gradient: 'linear-gradient(135deg, #ff5a2d 0%, #3e1a1a 60%, #0a0a0f 100%)',
  },
  {
    num: '03',
    title: 'Robot AI Telefonic',
    desc: 'Un agent vocal care răspunde la apeluri 24/7 în română, califică lead-urile și programează întâlniri.',
    meta: 'Voce AI · Preluare apeluri · Programări',
    gradient: 'linear-gradient(135deg, #8b5cff 0%, #2a1650 60%, #0a0a0f 100%)',
  },
  {
    num: '04',
    title: 'Facebook Ads',
    desc: 'Campanii Meta cu creative testate constant și optimizare pe cost per achiziție, nu pe like-uri.',
    meta: 'Meta · Instagram · Retargeting',
    gradient: 'linear-gradient(135deg, #2331f0 0%, #101040 60%, #0a0a0f 100%)',
  },
  {
    num: '05',
    title: 'Google Ads',
    desc: 'Search, Shopping și Performance Max — capturăm cererea exact în momentul deciziei de cumpărare.',
    meta: 'Search · Shopping · PMax',
    gradient: 'linear-gradient(135deg, #38b6ff 0%, #12283e 60%, #0a0a0f 100%)',
  },
  {
    num: '06',
    title: 'SEO',
    desc: 'Creștere organică sustenabilă: audit tehnic, conținut care rankează și autoritate de domeniu.',
    meta: 'Tehnic · Conținut · Link building',
    gradient: 'linear-gradient(135deg, #7bff9e 0%, #12321c 60%, #0a0a0f 100%)',
  },
  {
    num: '07',
    title: 'TikTok Ads',
    desc: 'Video-uri native care nu se simt a reclamă, pentru audiențe tinere care ignoră formatele clasice.',
    meta: 'Spark Ads · UGC · Creatori',
    gradient: 'linear-gradient(135deg, #ff2d7b 0%, #3e1030 60%, #0a0a0f 100%)',
  },
  {
    num: '08',
    title: 'Snapchat Ads',
    desc: 'Un canal subevaluat în România — costuri mici, audiență Gen Z, formate imersive full-screen.',
    meta: 'Snap Ads · AR · Story Ads',
    gradient: 'linear-gradient(135deg, #fff53d 0%, #3e3a10 60%, #0a0a0f 100%)',
  },
]

export interface Project {
  /** Stable key — projects can stay anonymous, so the name can't serve as one. */
  id: string
  /** Client name; omit to keep the case study anonymous. */
  name?: string
  category: string
  tags: string[]
  result: string
  gradient: string
  /** Optional cover image (path under /public); falls back to the gradient. */
  image?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'apex-auto',
    name: 'APEX Auto Atelier',
    category: 'Piese auto',
    tags: ['Website 3D', 'Piese auto', 'Google Ads'],
    result: '+214% lead-uri în 6 luni',
    gradient: 'linear-gradient(160deg, #0e3a63 0%, #0a1c33 45%, #050a12 100%)',
    image: '/projects/apex-auto.jpg',
  },
  {
    id: 'cb-smiles',
    name: 'CB Smiles',
    // the cover image already carries "STUDIO DENTAR · CLUJ-NAPOCA"
    category: 'Stomatologie',
    tags: ['Website 3D', 'Branding', 'SEO'],
    result: '+68% programări online',
    gradient: 'linear-gradient(160deg, #1d1b30 0%, #12111c 45%, #06060b 100%)',
    image: '/projects/cb-smiles.jpg',
  },
  {
    id: 'pt-tgm',
    // no name: the case study stays anonymous, and the cover image already
    // carries "PERSONAL TRAINER · TÂRGU MUREȘ"
    category: 'Fitness & Coaching',
    tags: ['Website', 'Scrollytelling', 'Social Media'],
    result: 'Agendă plină în 8 săptămâni',
    gradient: 'linear-gradient(160deg, #b0764a 0%, #4a2e1c 45%, #150d08 100%)',
    image: '/projects/daniela-german.jpg',
  },
  {
    id: 'ampera',
    name: 'AMPERA Sisteme Electrice',
    // the cover image already carries "ELECTRICIAN AUTORIZAT ANRE · CLUJ-NAPOCA"
    category: 'Instalații electrice',
    tags: ['Website 3D', 'Local SEO', 'Google Ads'],
    result: 'Cereri de ofertă triplate',
    gradient: 'linear-gradient(160deg, #1f7f9c 0%, #0d2b38 45%, #050c11 100%)',
    image: '/projects/ampera.jpg',
  },
  {
    id: 'fagurul-de-aur',
    name: 'Fagurul de Aur',
    category: 'Magazin online',
    tags: ['E-commerce', 'Branding', 'Facebook Ads'],
    result: '+42% comenzi în primul trimestru',
    gradient: 'linear-gradient(160deg, #d1a02a 0%, #6b4d10 45%, #201704 100%)',
    image: '/projects/fagurul-de-aur.jpg',
  },
]

export const ABOUT_WORDS: { text: string; accent?: boolean }[] = (() => {
  const paragraph =
    'Din 2022 lucrăm cot la cot cu *startup-uri* și afaceri tinere din România. Știm cum e să pornești cu buget strâns și presiune mare, așa că fiecare proiect începe cu o întrebare simplă: ce înseamnă *creștere* pentru afacerea ta? Apoi construim în jurul răspunsului: design care *convinge*, campanii optimizate pe *date* reale și o relație în care vorbim deschis despre cifre, nu despre promisiuni.'
  return paragraph.split(' ').map((w) => {
    const accent = w.startsWith('*')
    return { text: w.replace(/\*/g, ''), accent }
  })
})()

export interface Stat {
  value: number
  decimals?: number
  suffix: string
  label: string
}

export const STATS: Stat[] = [
  { value: 50, suffix: '+', label: 'proiecte livrate' },
  { value: 98, suffix: '%', label: 'clienți care revin' },
  // derivat din anul înființării, ca să nu rămână în urmă an de an
  { value: new Date().getFullYear() - FOUNDED, suffix: '', label: 'ani de experiență' },
  { value: 3.2, decimals: 1, suffix: 'x', label: 'ROAS mediu campanii' },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  project: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Vindeam miere bună, dar online arătam ca oricine altcineva. Acum site-ul spune povestea stupinei înainte să ajungă clientul la preț, iar oamenii comandă fără să mai întrebe de ce costă mai mult decât la supermarket.',
    name: 'Fagurul de Aur',
    role: 'Miere naturală, Gorj',
    project: 'Magazin online',
  },
  {
    quote:
      'Credeam că un electrician nu are ce căuta cu un site „de firmă mare". M-au contrazis elegant: acum oamenii sună deja convinși că lucrez ca la carte, nu ca să întrebe cât costă o priză.',
    name: 'AMPERA Sisteme Electrice',
    role: 'Electrician autorizat ANRE, Cluj-Napoca',
    project: 'Website 3D · Local SEO',
  },
  {
    quote:
      'Am cerut un site de piese auto și am primit ceva ce clienții îmi trimit înapoi cu „tare arată". Partea care contează: cererile de ofertă vin acum cu detaliile completate corect, nu cu trei cuvinte pe WhatsApp.',
    name: 'APEX Auto Atelier',
    role: 'Piese și service auto',
    project: 'Website 3D · Google Ads',
  },
]
