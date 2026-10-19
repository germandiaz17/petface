import { pool, query } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'

// MODELO Solicitud de adopción.
// Reglas de negocio:
//  - Solo se puede solicitar una mascota que no esté adoptada.
//  - Al crear una solicitud, una mascota "disponible" pasa a "en_proceso".
//  - Al aprobar: la mascota pasa a "adoptada" y las demás solicitudes pendientes se rechazan.
//  - Al rechazar/cancelar: si ya no quedan pendientes, la mascota vuelve a "disponible".

const SELECT_DETALLE = `
  SELECT s.*,
         m.nombre AS mascota_nombre, m.foto_url AS mascota_foto, m.estado AS mascota_estado,
         u.nombre AS usuario_nombre, u.email AS usuario_email
  FROM solicitudes s
  JOIN mascotas m ON m.id = s.mascota_id
  JOIN usuarios u ON u.id = s.usuario_id`

export async function findAll({ estado } = {}) {
  const { rows } = estado
    ? await query(`${SELECT_DETALLE} WHERE s.estado = $1 ORDER BY s.creado_en DESC`, [estado])
    : await query(`${SELECT_DETALLE} ORDER BY s.creado_en DESC`)
  return rows
}

export async function findByUsuario(usuarioId) {
  const { rows } = await query(
    `${SELECT_DETALLE} WHERE s.usuario_id = $1 ORDER BY s.creado_en DESC`,
    [usuarioId],
  )
  return rows
}

export async function findById(id) {
  const { rows } = await query(`${SELECT_DETALLE} WHERE s.id = $1`, [id])
  return rows[0] ?? null
}

// Ejecuta fn dentro de una transacción (todo o nada)
async function enTransaccion(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const resultado = await fn(client)
    await client.query('COMMIT')
    return resultado
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// Si la mascota ya no tiene solicitudes pendientes y estaba "en_proceso", vuelve a "disponible"
async function liberarMascotaSiNoHayPendientes(client, mascotaId) {
  await client.query(
    `UPDATE mascotas SET estado = 'disponible'
     WHERE id = $1 AND estado = 'en_proceso'
       AND NOT EXISTS (SELECT 1 FROM solicitudes WHERE mascota_id = $1 AND estado = 'pendiente')`,
    [mascotaId],
  )
}

export function create({ usuario_id, mascota_id, mensaje, telefono_contacto }) {
  return enTransaccion(async (client) => {
    // FOR UPDATE bloquea la fila para que dos solicitudes simultáneas no choquen
    const { rows } = await client.query('SELECT estado FROM mascotas WHERE id = $1 FOR UPDATE', [mascota_id])
    if (!rows[0]) throw new HttpError(404, 'Mascota no encontrada')
    if (rows[0].estado === 'adoptada') throw new HttpError(409, 'Esta mascota ya fue adoptada')

    const existe = await client.query(
      `SELECT 1 FROM solicitudes WHERE usuario_id = $1 AND mascota_id = $2 AND estado = 'pendiente'`,
      [usuario_id, mascota_id],
    )
    if (existe.rowCount) throw new HttpError(409, 'Ya tienes una solicitud pendiente para esta mascota')

    const insert = await client.query(
      `INSERT INTO solicitudes (usuario_id, mascota_id, mensaje, telefono_contacto)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [usuario_id, mascota_id, mensaje, telefono_contacto],
    )
    await client.query(`UPDATE mascotas SET estado = 'en_proceso' WHERE id = $1 AND estado = 'disponible'`, [mascota_id])
    return insert.rows[0]
  })
}

export function cambiarEstado(id, estado) {
  return enTransaccion(async (client) => {
    const { rows } = await client.query('SELECT * FROM solicitudes WHERE id = $1 FOR UPDATE', [id])
    const solicitud = rows[0]
    if (!solicitud) throw new HttpError(404, 'Solicitud no encontrada')
    if (solicitud.estado !== 'pendiente') {
      throw new HttpError(409, `La solicitud ya fue ${solicitud.estado}`)
    }

    await client.query('UPDATE solicitudes SET estado = $1 WHERE id = $2', [estado, id])

    if (estado === 'aprobada') {
      await client.query(`UPDATE mascotas SET estado = 'adoptada' WHERE id = $1`, [solicitud.mascota_id])
      await client.query(
        `UPDATE solicitudes SET estado = 'rechazada'
         WHERE mascota_id = $1 AND estado = 'pendiente' AND id <> $2`,
        [solicitud.mascota_id, id],
      )
    } else {
      await liberarMascotaSiNoHayPendientes(client, solicitud.mascota_id)
    }
    return { ...solicitud, estado }
  })
}

// El usuario cancela (borra) su propia solicitud pendiente
export function cancelar(id, usuarioId) {
  return enTransaccion(async (client) => {
    const { rows } = await client.query('SELECT * FROM solicitudes WHERE id = $1 FOR UPDATE', [id])
    const solicitud = rows[0]
    if (!solicitud || solicitud.usuario_id !== usuarioId) throw new HttpError(404, 'Solicitud no encontrada')
    if (solicitud.estado !== 'pendiente') throw new HttpError(409, 'Solo puedes cancelar solicitudes pendientes')

    await client.query('DELETE FROM solicitudes WHERE id = $1', [id])
    await liberarMascotaSiNoHayPendientes(client, solicitud.mascota_id)
  })
}

export async function resumen() {
  const { rows } = await query(`SELECT estado, COUNT(*)::int AS total FROM solicitudes GROUP BY estado`)
  return Object.fromEntries(rows.map((r) => [r.estado, r.total]))
}
