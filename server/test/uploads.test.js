// Pruebas de subida de fotos (POST /api/uploads)
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool, query } from '../src/config/db.js'
import { JWT_SECRET } from '../src/middlewares/auth.js'
import { UPLOADS_DIR } from '../src/config/uploads.js'

let server, base, tokenAdmin, tokenAna
const subidas = []

// PNG real de 1x1 píxel
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

const tokenPara = async (email) => {
  const { rows } = await query('SELECT id, nombre, email, rol FROM usuarios WHERE email = $1', [email])
  return jwt.sign(rows[0], JWT_SECRET)
}

async function subir(contenido, tipo, nombre, token) {
  const form = new FormData()
  form.append('foto', new Blob([contenido], { type: tipo }), nombre)
  const res = await fetch(`${base}/api/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const datos = await res.json()
  if (datos.url) subidas.push(datos.url)
  return { status: res.status, datos }
}

const existe = (url) => fs.existsSync(path.join(UPLOADS_DIR, path.basename(url)))
const archivosEnUploads = () => fs.readdirSync(UPLOADS_DIR).filter((f) => f !== '.gitkeep').length

before(async () => {
  server = app.listen(0)
  base = `http://localhost:${server.address().port}`
  tokenAdmin = await tokenPara('admin@petface.com')
  tokenAna = await tokenPara('ana@petface.com')
})

after(async () => {
  for (const url of subidas) fs.rmSync(path.join(UPLOADS_DIR, path.basename(url)), { force: true })
  server.close()
  await pool.end()
})

test('el admin sube una imagen y queda disponible en /uploads', async () => {
  const r = await subir(PNG, 'image/png', 'gato.png', tokenAdmin)
  assert.equal(r.status, 201)
  assert.match(r.datos.url, /^\/uploads\/[\w-]+\.png$/)

  const img = await fetch(base + r.datos.url)
  assert.equal(img.status, 200)
  assert.equal(img.headers.get('content-type'), 'image/png')
})

test('solo el admin puede subir', async () => {
  const antes = archivosEnUploads()
  assert.equal((await subir(PNG, 'image/png', 'a.png')).status, 401)
  assert.equal((await subir(PNG, 'image/png', 'a.png', tokenAna)).status, 403)
  assert.equal(archivosEnUploads(), antes) // no se guardó nada
})

test('rechaza archivos que no son imágenes', async () => {
  const antes = archivosEnUploads()
  const pdf = await subir(Buffer.from('%PDF-1.4'), 'application/pdf', 'doc.pdf', tokenAdmin)
  assert.equal(pdf.status, 400)

  // texto con tipo "image/png" falso: se detecta por la firma del archivo
  const falso = await subir(Buffer.from('no soy una imagen'), 'image/png', 'falso.png', tokenAdmin)
  assert.equal(falso.status, 400)
  assert.equal(archivosEnUploads(), antes)

  const vacio = await fetch(`${base}/api/uploads`, { method: 'POST', headers: { Authorization: `Bearer ${tokenAdmin}` } })
  assert.equal(vacio.status, 400)
})

test('rechaza imágenes de más de 5 MB', async () => {
  const grande = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024)])
  const r = await subir(grande, 'image/png', 'grande.png', tokenAdmin)
  assert.equal(r.status, 413)
})

test('al cambiar o borrar la foto de una mascota se elimina el archivo viejo', async () => {
  const foto1 = (await subir(PNG, 'image/png', '1.png', tokenAdmin)).datos.url
  const foto2 = (await subir(PNG, 'image/png', '2.png', tokenAdmin)).datos.url
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenAdmin}` }
  const body = { nombre: 'Con foto', especie: 'gato', genero: 'hembra' }

  const m = await (await fetch(`${base}/api/mascotas`, { method: 'POST', headers, body: JSON.stringify({ ...body, foto_url: foto1 }) })).json()
  await fetch(`${base}/api/mascotas/${m.id}`, { method: 'PUT', headers, body: JSON.stringify({ ...body, foto_url: foto2 }) })
  assert.equal(existe(foto1), false)
  assert.equal(existe(foto2), true)

  await fetch(`${base}/api/mascotas/${m.id}`, { method: 'DELETE', headers })
  assert.equal(existe(foto2), false)
})
