// Pruebas de la API contra la base de datos de desarrollo (npm run db:up).
// Crean sus propios datos y los borran al final.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool, query } from '../src/config/db.js'
import { JWT_SECRET } from '../src/middlewares/auth.js'

let server, base, tokenAdmin, tokenAna
const creadas = { mascotas: [], donaciones: [], testimonios: [] }

async function api(metodo, ruta, { token, body } = {}) {
  const res = await fetch(base + ruta, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  })
  const datos = res.status === 204 ? null : await res.json()
  return { status: res.status, datos }
}

const tokenPara = async (email) => {
  const { rows } = await query('SELECT id, nombre, email, rol FROM usuarios WHERE email = $1', [email])
  return jwt.sign(rows[0], JWT_SECRET)
}

before(async () => {
  server = app.listen(0)
  base = `http://localhost:${server.address().port}/api`
  tokenAdmin = await tokenPara('admin@petface.com')
  tokenAna = await tokenPara('ana@petface.com')
})

after(async () => {
  if (creadas.mascotas.length) await query('DELETE FROM mascotas WHERE id = ANY($1)', [creadas.mascotas])
  if (creadas.donaciones.length) await query('DELETE FROM donaciones WHERE id = ANY($1)', [creadas.donaciones])
  if (creadas.testimonios.length) await query('DELETE FROM testimonios WHERE id = ANY($1)', [creadas.testimonios])
  server.close()
  await pool.end()
})

const nuevaMascota = async (extra = {}) => {
  const { status, datos } = await api('POST', '/mascotas', {
    token: tokenAdmin,
    body: { nombre: 'Prueba', especie: 'perro', genero: 'macho', edad_meses: 6, ...extra },
  })
  assert.equal(status, 201)
  creadas.mascotas.push(datos.id)
  return datos
}

test('listar y filtrar mascotas (público)', async () => {
  const todas = await api('GET', '/mascotas')
  assert.equal(todas.status, 200)
  assert.ok(todas.datos.length >= 4)

  const gatos = await api('GET', '/mascotas?especie=gato')
  assert.ok(gatos.datos.every((m) => m.especie === 'gato'))

  const busqueda = await api('GET', '/mascotas?q=golden')
  assert.ok(busqueda.datos.some((m) => m.nombre === 'Bella'))

  const malo = await api('GET', '/mascotas?especie=dragon')
  assert.equal(malo.status, 400)
})

test('detalle de mascota y errores 404/400', async () => {
  assert.equal((await api('GET', '/mascotas/999999')).status, 404)
  assert.equal((await api('GET', '/mascotas/abc')).status, 400)
})

test('CRUD de mascotas solo para admin', async () => {
  const body = { nombre: 'X', especie: 'gato', genero: 'hembra' }
  assert.equal((await api('POST', '/mascotas', { body })).status, 401)
  assert.equal((await api('POST', '/mascotas', { token: tokenAna, body })).status, 403)

  const m = await nuevaMascota({ tamano: 'mediano' })
  assert.equal(m.estado, 'disponible')

  const sinNombre = await api('POST', '/mascotas', { token: tokenAdmin, body: { especie: 'gato', genero: 'hembra' } })
  assert.equal(sinNombre.status, 400)

  const editada = await api('PUT', `/mascotas/${m.id}`, {
    token: tokenAdmin,
    body: { nombre: 'Prueba editada', especie: 'perro', genero: 'macho' },
  })
  assert.equal(editada.status, 200)
  assert.equal(editada.datos.nombre, 'Prueba editada')
  assert.equal(editada.datos.estado, 'disponible') // se conserva si no se envía

  assert.equal((await api('DELETE', `/mascotas/${m.id}`, { token: tokenAdmin })).status, 204)
  assert.equal((await api('GET', `/mascotas/${m.id}`)).status, 404)
})

test('flujo de adopción: solicitar, cancelar, aprobar', async () => {
  const m = await nuevaMascota()
  const pedir = () =>
    api('POST', '/solicitudes', { token: tokenAna, body: { mascota_id: m.id, telefono_contacto: '3001112233' } })

  assert.equal((await api('POST', '/solicitudes', { body: { mascota_id: m.id } })).status, 401)

  const s1 = await pedir()
  assert.equal(s1.status, 201)
  assert.equal((await api('GET', `/mascotas/${m.id}`)).datos.estado, 'en_proceso')
  assert.equal((await pedir()).status, 409) // no se duplica la pendiente

  const mias = await api('GET', '/solicitudes/mias', { token: tokenAna })
  assert.ok(mias.datos.some((s) => s.id === s1.datos.id && s.mascota_nombre === 'Prueba'))

  // cancelar → la mascota vuelve a estar disponible
  assert.equal((await api('DELETE', `/solicitudes/${s1.datos.id}`, { token: tokenAna })).status, 204)
  assert.equal((await api('GET', `/mascotas/${m.id}`)).datos.estado, 'disponible')

  // nueva solicitud y el admin la aprueba
  const s2 = await pedir()
  assert.equal((await api('PATCH', `/solicitudes/${s2.datos.id}`, { token: tokenAna, body: { estado: 'aprobada' } })).status, 403)
  const aprobada = await api('PATCH', `/solicitudes/${s2.datos.id}`, { token: tokenAdmin, body: { estado: 'aprobada' } })
  assert.equal(aprobada.status, 200)
  assert.equal(aprobada.datos.estado, 'aprobada')
  assert.equal((await api('GET', `/mascotas/${m.id}`)).datos.estado, 'adoptada')

  // ya no se puede solicitar ni volver a cambiar
  assert.equal((await pedir()).status, 409)
  assert.equal((await api('PATCH', `/solicitudes/${s2.datos.id}`, { token: tokenAdmin, body: { estado: 'rechazada' } })).status, 409)

  const pendientes = await api('GET', '/solicitudes?estado=pendiente', { token: tokenAdmin })
  assert.equal(pendientes.status, 200)
})

test('rechazar la única solicitud libera la mascota', async () => {
  const m = await nuevaMascota()
  const s = await api('POST', '/solicitudes', { token: tokenAna, body: { mascota_id: m.id, telefono_contacto: '300' } })
  await api('PATCH', `/solicitudes/${s.datos.id}`, { token: tokenAdmin, body: { estado: 'rechazada' } })
  assert.equal((await api('GET', `/mascotas/${m.id}`)).datos.estado, 'disponible')
})

test('donaciones', async () => {
  const mala = await api('POST', '/donaciones', { body: { nombre: 'Juan', email: 'no-es-email', monto: 10 } })
  assert.equal(mala.status, 400)
  assert.equal((await api('POST', '/donaciones', { body: { nombre: 'Juan', email: 'j@x.com', monto: -5 } })).status, 400)

  const ok = await api('POST', '/donaciones', { body: { nombre: 'Juan', email: 'J@X.com', monto: 25.5 } })
  assert.equal(ok.status, 201)
  assert.equal(ok.datos.email, 'j@x.com')
  creadas.donaciones.push(ok.datos.id)

  assert.equal((await api('GET', '/donaciones')).status, 401)
  const lista = await api('GET', '/donaciones', { token: tokenAdmin })
  assert.ok(lista.datos.total >= 25.5)
})

test('testimonios: se crean pendientes y el admin los aprueba', async () => {
  const antes = (await api('GET', '/testimonios')).datos.length
  assert.ok(antes >= 7)

  const t = await api('POST', '/testimonios', { token: tokenAna, body: { texto: '¡Gran experiencia!' } })
  assert.equal(t.status, 201)
  assert.equal(t.datos.autor, 'Ana Rodríguez')
  assert.equal(t.datos.aprobado, false)
  creadas.testimonios.push(t.datos.id)
  assert.equal((await api('GET', '/testimonios')).datos.length, antes)

  const ap = await api('PATCH', `/testimonios/${t.datos.id}`, { token: tokenAdmin, body: { aprobado: true } })
  assert.equal(ap.datos.aprobado, true)
  assert.equal((await api('GET', '/testimonios')).datos.length, antes + 1)
})

test('resumen del admin y JSON inválido', async () => {
  assert.equal((await api('GET', '/admin/resumen', { token: tokenAna })).status, 403)
  const r = await api('GET', '/admin/resumen', { token: tokenAdmin })
  assert.equal(r.status, 200)
  assert.ok('mascotas' in r.datos && 'donaciones' in r.datos)

  const res = await fetch(base + '/donaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{malo' })
  assert.equal(res.status, 400)
})
