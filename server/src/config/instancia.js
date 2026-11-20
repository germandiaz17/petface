import crypto from 'node:crypto'

// Nombre de esta réplica (en Docker: api-1, api-2). Se devuelve en cada respuesta
// para poder ver qué réplica atendió la petición, y se usa como nombre de la
// conexión a PostgreSQL para saber qué réplica hizo cada cambio.
// Fuera de Docker se genera un nombre aleatorio por proceso (en Vercel: uno por instancia de la función).
export const INSTANCIA =
  process.env.INSTANCIA ?? `${process.env.VERCEL ? 'vercel' : 'local'}-${crypto.randomUUID().slice(0, 6)}`
