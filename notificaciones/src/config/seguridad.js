import crypto from 'node:crypto'

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('Falta la variable de entorno JWT_SECRET')
}
// Mismo secreto que la API: así este servicio valida las sesiones sin preguntarle a nadie
export const JWT_SECRET = process.env.JWT_SECRET ?? 'secreto-solo-para-desarrollo'

// Clave para que solo la API pueda enviar eventos. Se deriva del JWT_SECRET,
// así ambos servicios la conocen sin configurar otra variable.
export const CLAVE_INTERNA = crypto.createHmac('sha256', JWT_SECRET).update('petface-eventos').digest('hex')

// Nombre de esta instancia (en Docker: el nombre del contenedor)
export const INSTANCIA = process.env.INSTANCIA ?? `${process.env.VERCEL ? 'vercel' : 'local'}-notif-${crypto.randomUUID().slice(0, 6)}`
