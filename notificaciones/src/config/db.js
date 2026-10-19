import pg from 'pg'

// El microservicio usa el mismo servidor de PostgreSQL, pero es dueño de SU tabla
// ("notificaciones"): ningún otro servicio la lee ni la escribe.
// Neon entrega la URL con sslmode=require; pg ya lo trata como verify-full pero lo avisa
// en cada conexión. Pedimos verify-full explícitamente para evitar ese ruido en los logs.
const normalizarSsl = (url) => url.replace(/sslmode=(prefer|require|verify-ca)\b/, 'sslmode=verify-full')

export const pool = new pg.Pool({
  connectionString: normalizarSsl(process.env.DATABASE_URL ?? 'postgres://petface:petface@localhost:5432/petface'),
  max: process.env.VERCEL ? 2 : 5,
})

export const query = (text, params) => pool.query(text, params)

// El servicio crea su propia tabla al arrancar (no depende de los scripts de la API)
let lista
export function asegurarTabla() {
  lista ??= query(`
    CREATE TABLE IF NOT EXISTS notificaciones (
      id          SERIAL PRIMARY KEY,
      usuario_id  INTEGER,                -- destinatario concreto (o NULL)
      rol_destino VARCHAR(20),            -- o todos los usuarios de un rol, p. ej. 'admin'
      titulo      VARCHAR(150) NOT NULL,
      mensaje     TEXT NOT NULL,
      enlace      VARCHAR(255),
      leida       BOOLEAN NOT NULL DEFAULT FALSE,
      creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS notificaciones_usuario ON notificaciones (usuario_id, creado_en DESC);
  `).catch((err) => {
    lista = undefined // reintentar en la próxima petición
    throw err
  })
  return lista
}
