// Pruebas del microservicio de notificaciones (por sí solo)
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool, query } from '../src/config/db.js'
import { CLAVE_INTERNA, JWT_SECRET } from '../src/config/seguridad.js'

let server, base
// Usuarios ficticios (este servicio no consulta la tabla de usuarios: confía en el JWT)
const ADOPTANTE = { id: 990001, nombre: 'Prueba', rol: 'adoptante' }
const ADMIN = { id: 990002, nombre: 'Admin prueba', rol: 'admin' }
const cookie = (u) => `token=${jwt.sign(u, JWT_SECRET)}`

const evento = (tipo, datos, clave = CLAVE_INTERNA) =>
  fetch(`${base}/notif/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Clave-Interna': clave },
    body: JSON.stringify({ tipo, datos }),
  })
const misNotificaciones = async (u) => (await fetch(`${base}/notif/notificaciones`, { headers: { Cookie: cookie(u) } })).json()

before(() => {
  server = app.listen(0)
  base = `http://localhost:${server.address().port}`
})
after(async () => {
  await query('DELETE FROM notificaciones WHERE usuario_id = $1 OR mensaje LIKE $2', [ADOPTANTE.id, '%[test]%'])
  server.close()
  await pool.end()
})

test('responde su estado de salud', async () => {
  const r = await fetch(`${base}/notif/health`)
  assert.equal(r.status, 200)
  assert.equal((await r.json()).servicio, 'notificaciones')
  assert.ok(r.headers.get('x-instancia'))
})

test('solo acepta eventos con la clave interna', async () => {
  assert.equal((await evento('solicitud.aprobada', { usuario_id: 1 }, 'clave-falsa')).status, 401)
  assert.equal((await evento('evento.inventado', {})).status, 400)
})

test('un evento crea la notificación para el destinatario correcto', async () => {
  const r = await evento('solicitud.aprobada', { usuario_id: ADOPTANTE.id, mascota_id: 1, mascota_nombre: 'Luna' })
  assert.equal(r.status, 201)

  const mias = await misNotificaciones(ADOPTANTE)
  assert.equal(mias.no_leidas, 1)
  assert.match(mias.notificaciones[0].mensaje, /Luna/)

  // otro usuario no la ve
  const otro = await misNotificaciones({ id: 990003, nombre: 'Otro', rol: 'adoptante' })
  assert.ok(otro.notificaciones.every((n) => n.usuario_id !== ADOPTANTE.id))
})

test('las notificaciones de rol llegan a los admins', async () => {
  await evento('testimonio.creado', { autor: 'Autor [test]' })
  const deAdmin = await misNotificaciones(ADMIN)
  assert.ok(deAdmin.notificaciones.some((n) => n.mensaje.includes('Autor [test]')))
})

test('marcar como leídas y exigir sesión', async () => {
  assert.equal((await fetch(`${base}/notif/notificaciones`)).status, 401)
  const r = await fetch(`${base}/notif/notificaciones/leidas`, { method: 'PATCH', headers: { Cookie: cookie(ADOPTANTE) } })
  assert.equal(r.status, 204)
  assert.equal((await misNotificaciones(ADOPTANTE)).no_leidas, 0)
})
