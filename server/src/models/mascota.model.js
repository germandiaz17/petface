import { query } from '../config/db.js'

// MODELO Mascota: todo el SQL de la tabla "mascotas".

const CAMPOS = ['nombre', 'especie', 'raza', 'edad_meses', 'genero', 'tamano', 'descripcion', 'foto_url', 'estado']

// Filtros opcionales: especie, genero, tamano, estado y q (busca en nombre/raza)
export async function findAll({ especie, genero, tamano, estado, q } = {}) {
  const condiciones = []
  const valores = []
  // agrega una condición; cada "?" se reemplaza por el parámetro $n
  const agregar = (sql, valor) => {
    valores.push(valor)
    condiciones.push(sql.replaceAll('?', `$${valores.length}`))
  }

  if (especie) agregar('especie = ?', especie)
  if (genero) agregar('genero = ?', genero)
  if (tamano) agregar('tamano = ?', tamano)
  if (estado) agregar('estado = ?', estado)
  if (q) agregar('(nombre ILIKE ? OR raza ILIKE ?)', `%${q}%`)

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''
  const { rows } = await query(`SELECT * FROM mascotas ${where} ORDER BY creado_en DESC, id DESC`, valores)
  return rows
}

export async function findById(id) {
  const { rows } = await query('SELECT * FROM mascotas WHERE id = $1', [id])
  return rows[0] ?? null
}

export async function create(datos) {
  const valores = CAMPOS.map((c) => datos[c] ?? null)
  const { rows } = await query(
    `INSERT INTO mascotas (${CAMPOS.join(', ')})
     VALUES (${CAMPOS.map((_, i) => `$${i + 1}`).join(', ')})
     RETURNING *`,
    valores,
  )
  return rows[0]
}

export async function update(id, datos) {
  const valores = CAMPOS.map((c) => datos[c] ?? null)
  const { rows } = await query(
    `UPDATE mascotas SET ${CAMPOS.map((c, i) => `${c} = $${i + 1}`).join(', ')}
     WHERE id = $${CAMPOS.length + 1}
     RETURNING *`,
    [...valores, id],
  )
  return rows[0] ?? null
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM mascotas WHERE id = $1', [id])
  return rowCount > 0
}

// Conteo por estado, para el panel de admin
export async function resumen() {
  const { rows } = await query(
    `SELECT estado, COUNT(*)::int AS total FROM mascotas GROUP BY estado`,
  )
  return Object.fromEntries(rows.map((r) => [r.estado, r.total]))
}
