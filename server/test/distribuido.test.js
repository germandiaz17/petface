// Prueba de integración: la API y el microservicio de notificaciones corriendo
// como dos servidores separados que se comunican por HTTP.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import api from '../src/app.js'
import notif from '../../notificaciones/src/app.js'
import { pool, query } from '../src/config/db.js'
import { pool as poolNotif } from '../../notificaciones/src/config/db.js'
import { JWT_SECRET } from '../src/middlewares/auth.js'

let servidorApi, servidorNotif, baseApi, baseNotif, tokenAna, tokenAdmin, mascotaId

const pedir = (base, metodo, ruta, token, body) =>
  fetch(base + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(token && { Cookie: `token=${token}` }) },
    body: body && JSON.stringify(body),
  })

const tokenPara = async (email) => {
  const { rows } = await query('SELECT id, nombre, email, rol FROM usuarios WHERE email = $1', [email])
  return jwt.sign(rows[0], JWT_SECRET)
}

before(async () => {
  servidorNotif = notif.listen(0)
  baseNotif = `http://localhost:${servidorNotif.address().port}`
  process.env.NOTIF_URL = baseNotif // la API encontrará al microservicio aquí
  servidorApi = api.listen(0)
  baseApi = `http://localhost:${servidorApi.address().port}`
  tokenAna = await tokenPara('ana@petface.com')
  tokenAdmin = await tokenPara('admin@petface.com')
  const m = await (await pedir(baseApi, 'POST', '/api/mascotas', tokenAdmin, { nombre: 'Distribuida', especie: 'gato', genero: 'macho' })).json()
  mascotaId = m.id
})

after(async () => {
  await query('DELETE FROM mascotas WHERE id = $1', [mascotaId])
  await poolNotif.query("DELETE FROM notificaciones WHERE mensaje LIKE '%Distribuida%'")
  delete process.env.NOTIF_URL
  servidorApi.close()
  servidorNotif.close()
  await Promise.all([pool.end(), poolNotif.end()])
})

test('aprobar una solicitud en la API genera la notificación en el microservicio', async () => {
  const s = await (await pedir(baseApi, 'POST', '/api/solicitudes', tokenAna, { mascota_id: mascotaId, telefono_contacto: '300' })).json()

  // el admin recibe el aviso de la nueva solicitud
  const delAdmin = await (await pedir(baseNotif, 'GET', '/notif/notificaciones', tokenAdmin)).json()
  assert.ok(delAdmin.notificaciones.some((n) => n.mensaje.includes('quiere adoptar a Distribuida')))

  await pedir(baseApi, 'PATCH', `/api/solicitudes/${s.id}`, tokenAdmin, { estado: 'aprobada' })

  // Ana recibe el aviso de aprobación, servido por OTRO servidor
  const deAna = await (await pedir(baseNotif, 'GET', '/notif/notificaciones', tokenAna)).json()
  assert.ok(deAna.notificaciones.some((n) => n.titulo.includes('aprobada') && n.mensaje.includes('Distribuida')))
})

test('si el microservicio está caído, la API sigue funcionando', async () => {
  process.env.NOTIF_URL = 'http://localhost:9' // puerto donde no hay nadie
  const inicio = Date.now()
  const r = await pedir(baseApi, 'POST', '/api/donaciones', null, { nombre: 'Tolerante', email: 't@x.com', monto: 1000 })
  assert.equal(r.status, 201) // la donación se guarda igual
  assert.ok(Date.now() - inicio < 2500) // y no se queda colgada
  await query('DELETE FROM donaciones WHERE id = $1', [(await r.json()).id])
  process.env.NOTIF_URL = baseNotif
})
