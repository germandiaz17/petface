import { query } from '../config/db.js'

// Modelo mínimo: comprueba la conexión y cuenta las mascotas sembradas.
export async function check() {
  const { rows } = await query(
    'SELECT NOW() AS hora, (SELECT COUNT(*)::int FROM mascotas) AS mascotas',
  )
  return rows[0]
}
