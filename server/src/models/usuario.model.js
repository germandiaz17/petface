import { query } from '../config/db.js'

// MODELO Usuario. Nunca devuelve password_hash salvo en findByEmailConPassword (para el login).

const PUBLICOS = 'id, nombre, email, telefono, rol, creado_en'

export async function findByEmailConPassword(email) {
  const { rows } = await query(`SELECT ${PUBLICOS}, password_hash FROM usuarios WHERE email = $1`, [email])
  return rows[0] ?? null
}

export async function findById(id) {
  const { rows } = await query(`SELECT ${PUBLICOS} FROM usuarios WHERE id = $1`, [id])
  return rows[0] ?? null
}

export async function existeEmail(email) {
  const { rowCount } = await query('SELECT 1 FROM usuarios WHERE email = $1', [email])
  return rowCount > 0
}

// Los usuarios que se registran solos siempre son "adoptante"
export async function create({ nombre, email, password_hash, telefono }) {
  const { rows } = await query(
    `INSERT INTO usuarios (nombre, email, password_hash, telefono)
     VALUES ($1, $2, $3, $4) RETURNING ${PUBLICOS}`,
    [nombre, email, password_hash, telefono],
  )
  return rows[0]
}
