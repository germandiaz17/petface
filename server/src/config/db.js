import pg from 'pg'

// Pool de conexiones a PostgreSQL. Los modelos usan query() para hablar con la BD.
// En local apunta al Postgres de Docker; en Vercel usa DATABASE_URL (Neon).
// Neon entrega la URL con sslmode=require; pg ya lo trata como verify-full pero lo avisa
// en cada conexión. Pedimos verify-full explícitamente para evitar ese ruido en los logs.
const normalizarSsl = (url) => url.replace(/sslmode=(prefer|require|verify-ca)\b/, 'sslmode=verify-full')

export const pool = new pg.Pool({
  connectionString: normalizarSsl(
    process.env.DATABASE_URL ?? 'postgres://petface:petface@localhost:5432/petface',
  ),
  // En Vercel cada función es una instancia pequeña: pocas conexiones por instancia
  max: process.env.VERCEL ? 3 : 10,
})

// Siempre con parámetros ($1, $2...) para evitar inyección SQL.
export const query = (text, params) => pool.query(text, params)
