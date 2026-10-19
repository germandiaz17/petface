import pg from 'pg'

// Pool de conexiones a PostgreSQL. Los modelos usan query() para hablar con la BD.
export const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://petface:petface@localhost:5432/petface',
})

// Siempre con parámetros ($1, $2...) para evitar inyección SQL.
export const query = (text, params) => pool.query(text, params)
