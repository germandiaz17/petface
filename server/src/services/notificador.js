import crypto from 'node:crypto'
import { JWT_SECRET } from '../middlewares/auth.js'

// Cliente del microservicio de notificaciones.
// La API solo avisa "pasó X"; el microservicio decide a quién notificar y cómo.

// Dónde está el microservicio:
//  - NOTIF_URL si se define (Docker: http://notificaciones:3001)
//  - En Vercel: la URL pública del propio despliegue (el gateway enruta /notif)
//  - En local: http://localhost:3001
function urlServicio() {
  if (process.env.NOTIF_URL) return process.env.NOTIF_URL
  if (process.env.VERCEL) {
    const dominio = process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL
    return `https://${dominio}`
  }
  return 'http://localhost:3001'
}

// Misma derivación que en el microservicio: ambos comparten JWT_SECRET
const CLAVE_INTERNA = crypto.createHmac('sha256', JWT_SECRET).update('petface-eventos').digest('hex')
const TIEMPO_LIMITE_MS = 2000

// Envía un evento. NUNCA lanza error: si el microservicio está caído o tarda,
// la operación principal (aprobar, donar…) sigue funcionando igual. Tolerancia a fallos.
export async function enviarEvento(tipo, datos) {
  try {
    const res = await fetch(`${urlServicio()}/notif/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Clave-Interna': CLAVE_INTERNA },
      body: JSON.stringify({ tipo, datos }),
      signal: AbortSignal.timeout(TIEMPO_LIMITE_MS),
    })
    if (!res.ok) console.warn(`[notificador] ${tipo}: el servicio respondió ${res.status}`)
    return res.ok
  } catch (err) {
    console.warn(`[notificador] ${tipo}: servicio no disponible (${err.name}). La operación continúa.`)
    return false
  }
}

export { urlServicio }
