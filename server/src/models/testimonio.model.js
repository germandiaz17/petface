import { query } from '../config/db.js'

// MODELO Testimonio. Los nuevos llegan sin aprobar; el admin los aprueba.

export async function findAprobados() {
  const { rows } = await query(
    'SELECT id, autor, texto, creado_en FROM testimonios WHERE aprobado ORDER BY creado_en DESC, id DESC',
  )
  return rows
}

export async function findAll() {
  const { rows } = await query('SELECT * FROM testimonios ORDER BY aprobado, creado_en DESC')
  return rows
}

export async function create({ usuario_id, autor, texto }) {
  const { rows } = await query(
    'INSERT INTO testimonios (usuario_id, autor, texto) VALUES ($1, $2, $3) RETURNING *',
    [usuario_id, autor, texto],
  )
  return rows[0]
}

export async function setAprobado(id, aprobado) {
  const { rows } = await query(
    'UPDATE testimonios SET aprobado = $1 WHERE id = $2 RETURNING *',
    [aprobado, id],
  )
  return rows[0] ?? null
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM testimonios WHERE id = $1', [id])
  return rowCount > 0
}
