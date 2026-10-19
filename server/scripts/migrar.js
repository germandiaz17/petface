// Crea las tablas y carga los datos de demo SOLO si la base de datos está vacía.
// Se ejecuta en cada despliegue de Vercel (ver "vercel-build" en package.json):
// la primera vez prepara la BD y las siguientes no toca nada.
//
// Uso local: npm run db:migrar
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.warn('[migrar] DATABASE_URL no está definida: se omite la preparación de la base de datos.')
  process.exit(0)
}

const carpeta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database')
const leer = (archivo) => fs.readFileSync(path.join(carpeta, archivo), 'utf8')

const client = new pg.Client({ connectionString: url })
await client.connect()
try {
  const { rows } = await client.query(`SELECT to_regclass('public.usuarios') IS NOT NULL AS existe`)
  if (rows[0].existe) {
    console.log('[migrar] Las tablas ya existen: no se modifica nada.')
  } else {
    console.log('[migrar] Base de datos vacía: creando tablas y datos de demo…')
    await client.query('BEGIN')
    await client.query(leer('schema.sql'))
    await client.query(leer('seed.sql'))
    await client.query('COMMIT')
    console.log('[migrar] Listo.')
  }
} catch (err) {
  await client.query('ROLLBACK').catch(() => {})
  console.error('[migrar] Error:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
