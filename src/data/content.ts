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
    title: 'Facebook Ads',
    desc: 'Campanii Meta cu creative testate constant și optimizare pe cost per achiziție, nu pe like-uri.',
    meta: 'Meta · Instagram · Retargeting',
    gradient: 'linear-gradient(135deg, #2331f0 0%, #101040 60%, #0a0a0f 100%)',
  },
  {
    num: '04',
    title: 'Google Ads',
    desc: 'Search, Shopping și Performance Max — capturăm cererea exact în momentul deciziei de cumpărare.',
    meta: 'Search · Shopping · PMax',
    gradient: 'linear-gradient(135deg, #38b6ff 0%, #12283e 60%, #0a0a0f 100%)',
  },
  {
    num: '05',
    title: 'SEO',
    desc: 'Creștere organică sustenabilă: audit tehnic, conținut care rankează și autoritate de domeniu.',
    meta: 'Tehnic · Conținut · Link building',
    gradient: 'linear-gradient(135deg, #7bff9e 0%, #12321c 60%, #0a0a0f 100%)',
  },
  {
    num: '06',
    title: 'TikTok Ads',
    desc: 'Video-uri native care nu se simt a reclamă, pentru audiențe tinere care ignoră formatele clasice.',
    meta: 'Spark Ads · UGC · Creatori',
    gradient: 'linear-gradient(135deg, #ff2d7b 0%, #3e1030 60%, #0a0a0f 100%)',
  },
  {
    num: '07',
    title: 'Snapchat Ads',
    desc: 'Un canal subevaluat în România — costuri mici, audiență Gen Z, formate imersive full-screen.',
    meta: 'Snap Ads · AR · Story Ads',
    gradient: 'linear-gradient(135deg, #fff53d 0%, #3e3a10 60%, #0a0a0f 100%)',
  },
]

export interface Project {
  name: string
  category: string
  tags: string[]
  result: string
  gradient: string
}

export const PROJECTS: Project[] = [
  {
    name: 'NovaTech Startup',
    category: 'Website & Branding',
    tags: ['Website', 'SEO', 'Google Ads'],
    result: '+214% lead-uri în 6 luni',
    gradient: 'linear-gradient(160deg, #4d6bff 0%, #2331f0 45%, #0d0d24 100%)',
  },
  {
    name: 'Urban Bites',
    category: 'E-commerce',
    tags: ['Magazin online', 'Facebook Ads', 'TikTok Ads'],
    result: 'ROAS 4.1x în primul trimestru',
    gradient: 'linear-gradient(160deg, #ff5a2d 0%, #b0330f 45%, #240d0d 100%)',
  },
  {
    name: 'FitFlow App',
    category: 'Landing & Performance',
    tags: ['Landing page', 'TikTok Ads', 'Snapchat Ads'],
    result: '38.000 instalări în 90 de zile',
    gradient: 'linear-gradient(160deg, #ff2d7b 0%, #7b1445 45%, #1c0a16 100%)',
  },
  {
    name: 'Casa Verde Imobiliare',
    category: 'Website & Lead Gen',
    tags: ['Website', 'Google Ads', 'CRO'],
    result: 'Cost pe lead redus cu 57%',
    gradient: 'linear-gradient(160deg, #7bff9e 0%, #1f8a4a 45%, #0a1c10 100%)',
  },
  {
    name: 'Atelier Lumina',
    category: 'E-commerce & SEO',
    tags: ['Magazin online', 'SEO', 'Email'],
    result: 'Trafic organic dublat într-un an',
    gradient: 'linear-gradient(160deg, #ffd23d 0%, #b08a0f 45%, #241c08 100%)',
  },
]

export const ABOUT_WORDS: { text: string; accent?: boolean }[] = (() => {
  const paragraph =
    'Suntem un *spot* de idei, nu o fabrică de site-uri. La Idea Software Spot fiecare proiect începe cu o întrebare simplă: ce înseamnă *rezultat* pentru afacerea ta? Apoi construim în jurul răspunsului — design care *convinge*, campanii care se optimizează pe *date* reale și o relație în care vorbim deschis despre cifre, nu despre promisiuni.'
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
  { value: 5, suffix: '', label: 'ani de experiență' },
  { value: 3.2, decimals: 1, suffix: 'x', label: 'ROAS mediu campanii' },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'În trei luni de la lansarea noului site, rata de conversie s-a triplat. Echipa nu ne-a vândut „un site frumos", ne-a construit un instrument de vânzare.',
    name: 'Andrei Munteanu',
    role: 'Fondator, NovaTech Startup',
  },
  {
    quote:
      'Am lucrat cu trei agenții înainte. Idea Software Spot e prima care ne trimite lunar un raport pe care chiar îl înțelegem — și cifre care chiar cresc.',
    name: 'Ioana Dragomir',
    role: 'Marketing Manager, Urban Bites',
  },
  {
    quote:
      'Campaniile de TikTok păreau un pariu riscant pentru noi. Au devenit canalul cu cel mai mic cost pe instalare din tot mixul nostru media.',
    name: 'Radu Ilie',
    role: 'CEO, FitFlow App',
  },
  {
    quote:
      'Ne-au spus de la început ce nu va funcționa și de ce. Genul ăsta de onestitate valorează mai mult decât orice prezentare de agenție.',
    name: 'Elena Stancu',
    role: 'Director, Casa Verde Imobiliare',
  },
]
