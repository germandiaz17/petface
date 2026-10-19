// Pruebas de registro / login / sesión con cookie real.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import app from '../src/app.js'
import { pool, query } from '../src/config/db.js'

let server, base
const EMAIL_NUEVO = `prueba-${Date.now()}@test.com`

async function api(metodo, ruta, { body, cookie } = {}) {
  const res = await fetch(base + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(cookie && { Cookie: cookie }) },
    body: body && JSON.stringify(body),
  })
  const datos = res.status === 204 ? null : await res.json()
  // nos quedamos con "token=..." de Set-Cookie para reenviarlo
  const cookieNueva = res.headers.get('set-cookie')?.split(';')[0]
  return { status: res.status, datos, cookie: cookieNueva, setCookie: res.headers.get('set-cookie') }
}

before(() => {
  server = app.listen(0)
  base = `http://localhost:${server.address().port}/api`
})

after(async () => {
  await query('DELETE FROM usuarios WHERE email = $1', [EMAIL_NUEVO])
  server.close()
  await pool.end()
})

test('login del admin del seed (hash bcrypt creado con pgcrypto)', async () => {
  const r = await api('POST', '/auth/login', { body: { email: 'ADMIN@petface.com', password: 'admin123' } })
  assert.equal(r.status, 200)
  assert.equal(r.datos.rol, 'admin')
  assert.equal(r.datos.password_hash, undefined)
  assert.match(r.setCookie, /HttpOnly/i)

  const me = await api('GET', '/auth/me', { cookie: r.cookie })
  assert.equal(me.status, 200)
  assert.equal(me.datos.email, 'admin@petface.com')

  // la cookie sirve para rutas de admin
  assert.equal((await api('GET', '/admin/resumen', { cookie: r.cookie })).status, 200)
})

test('login con datos incorrectos', async () => {
  const mal = await api('POST', '/auth/login', { body: { email: 'admin@petface.com', password: 'otra' } })
  assert.equal(mal.status, 401)
  const noExiste = await api('POST', '/auth/login', { body: { email: 'nadie@x.com', password: 'admin123' } })
  assert.equal(noExiste.status, 401)
  assert.equal(mal.datos.error, noExiste.datos.error) // mismo mensaje
  assert.equal((await api('POST', '/auth/login', { body: { email: 'no-email' } })).status, 400)
})

test('registro, sesión y logout', async () => {
  const corta = await api('POST', '/auth/registro', { body: { nombre: 'P', email: EMAIL_NUEVO, password: '123' } })
  assert.equal(corta.status, 400)

  const r = await api('POST', '/auth/registro', {
    body: { nombre: 'Persona Prueba', email: EMAIL_NUEVO, password: 'clave-segura', rol: 'admin' },
  })
  assert.equal(r.status, 201)
  assert.equal(r.datos.rol, 'adoptante') // no se puede auto-asignar admin

  const repetido = await api('POST', '/auth/registro', { body: { nombre: 'X', email: EMAIL_NUEVO, password: 'clave-segura' } })
  assert.equal(repetido.status, 409)

  assert.equal((await api('GET', '/auth/me', { cookie: r.cookie })).status, 200)
  assert.equal((await api('GET', '/admin/resumen', { cookie: r.cookie })).status, 403)

  const out = await api('POST', '/auth/logout', { cookie: r.cookie })
  assert.equal(out.status, 204)
  assert.match(out.setCookie, /token=;/)

  assert.equal((await api('GET', '/auth/me')).status, 401)
  assert.equal((await api('GET', '/auth/me', { cookie: 'token=falso' })).status, 401)
})

test('bloquea el login tras 5 intentos fallidos', async () => {
  const intentar = (password) => api('POST', '/auth/login', { body: { email: EMAIL_NUEVO, password } })
  for (let i = 0; i < 5; i++) assert.equal((await intentar('mala-clave')).status, 401)

  const bloqueado = await intentar('clave-segura') // ni con la contraseña correcta
  assert.equal(bloqueado.status, 429)
  assert.match(bloqueado.datos.error, /Demasiados intentos/)

  // otras cuentas no se ven afectadas
  assert.equal((await api('POST', '/auth/login', { body: { email: 'ana@petface.com', password: 'ana12345' } })).status, 200)
})
