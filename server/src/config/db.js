import pg from 'pg'

// Pool de conexiones a PostgreSQL. Los modelos usan query() para hablar con la BD.
// En local apunta al Postgres de Docker; en Vercel usa DATABASE_URL (Neon).
export const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://petface:petface@localhost:5432/petface',
  // En Vercel cada función es una instancia pequeña: pocas conexiones por instancia
  max: process.env.VERCEL ? 3 : 10,
})

// Siempre con parámetros ($1, $2...) para evitar inyección SQL.
export const query = (text, params) => pool.query(text, params)
