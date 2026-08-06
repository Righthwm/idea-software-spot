/**
 * POST /api/contact — trimite mesajele din formularul de contact prin Resend.
 *
 * Variabile de mediu (setate în Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  obligatoriu — cheia din resend.com/api-keys
 *   CONTACT_TO      opțional — destinatarul (implicit adresa de mai jos)
 *   CONTACT_FROM    opțional — expeditorul; trebuie să fie pe un domeniu
 *                   verificat în Resend. Fără el se folosește onboarding@resend.dev,
 *                   care poate livra DOAR către adresa contului Resend.
 */

/**
 * Runtime edge: handler-ul de mai jos e scris în stil Web (primește `Request`,
 * întoarce `Response`). Pe runtime-ul Node, Vercel ar aștepta `(req, res)` și
 * ar ignora valoarea returnată — cererea ar atârna până la timeout.
 */
export const config = { runtime: 'edge' }

const DEFAULT_TO = 'ideasoftwarespot@gmail.com'
const DEFAULT_FROM = 'Formular Idea Software Spot <onboarding@resend.dev>'

const MAX = { nume: 120, email: 200, mesaj: 5000 }

/** Neutralizează HTML-ul venit din formular înainte să ajungă în corpul mailului. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY lipsește din environment')
    return Response.json({ error: 'Serviciul de email nu e configurat.' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Cerere invalidă.' }, { status: 400 })
  }

  // honeypot: botii completează câmpul ascuns, oamenii nu îl văd
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return Response.json({ ok: true })
  }

  const nume = String(body.nume ?? '').trim()
  const email = String(body.email ?? '').trim()
  const mesaj = String(body.mesaj ?? '').trim()

  if (!nume || !email || !mesaj) {
    return Response.json({ error: 'Completează toate câmpurile.' }, { status: 400 })
  }
  if (!isEmail(email)) {
    return Response.json({ error: 'Adresa de email nu pare validă.' }, { status: 400 })
  }
  if (nume.length > MAX.nume || email.length > MAX.email || mesaj.length > MAX.mesaj) {
    return Response.json({ error: 'Mesajul este prea lung.' }, { status: 400 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || DEFAULT_FROM,
      to: [process.env.CONTACT_TO || DEFAULT_TO],
      // răspunzi direct din inbox și mailul pleacă spre client, nu spre tine
      reply_to: email,
      subject: `Cerere nouă de pe site — ${nume}`,
      html: `
        <h2 style="margin:0 0 16px;font-family:sans-serif">Mesaj nou din formularul de contact</h2>
        <p style="font-family:sans-serif"><strong>Nume:</strong> ${escapeHtml(nume)}</p>
        <p style="font-family:sans-serif"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="font-family:sans-serif"><strong>Mesaj:</strong></p>
        <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(mesaj)}</p>
      `,
      text: `Mesaj nou din formularul de contact\n\nNume: ${nume}\nEmail: ${email}\n\n${mesaj}`,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend a returnat', res.status, detail)
    return Response.json({ error: 'Mesajul nu a putut fi trimis.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
