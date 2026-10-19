import { query } from '../config/db.js'

// MODELO Notificación

export async function crear({ usuario_id = null, rol_destino = null, titulo, mensaje, enlace = null }) {
  const { rows } = await query(
    `INSERT INTO notificaciones (usuario_id, rol_destino, titulo, mensaje, enlace)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [usuario_id, rol_destino, titulo, mensaje, enlace],
  )
  return rows[0]
}

// Las del usuario + las dirigidas a su rol (p. ej. todos los admins)
export async function delUsuario({ id, rol }, limite = 20) {
  const { rows } = await query(
    `SELECT * FROM notificaciones
     WHERE usuario_id = $1 OR rol_destino = $2
     ORDER BY creado_en DESC, id DESC LIMIT $3`,
    [id, rol, limite],
  )
  return rows
}

export async function contarNoLeidas({ id, rol }) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS total FROM notificaciones
     WHERE (usuario_id = $1 OR rol_destino = $2) AND NOT leida`,
    [id, rol],
  )
  return rows[0].total
}

export async function marcarLeidas({ id, rol }) {
  await query(
    `UPDATE notificaciones SET leida = TRUE
     WHERE (usuario_id = $1 OR rol_destino = $2) AND NOT leida`,
    [id, rol],
  )
}
