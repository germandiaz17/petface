import { query } from '../config/db.js'

// MODELO Donación (simulada: no hay pasarela de pago real)

export async function create({ usuario_id, nombre, email, monto }) {
  const { rows } = await query(
    `INSERT INTO donaciones (usuario_id, nombre, email, monto)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [usuario_id, nombre, email, monto],
  )
  return rows[0]
}

export async function findAll() {
  const { rows } = await query('SELECT * FROM donaciones ORDER BY creado_en DESC')
  return rows
}

export async function resumen() {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS cantidad, COALESCE(SUM(monto), 0)::float AS total FROM donaciones',
  )
  return rows[0]
}
