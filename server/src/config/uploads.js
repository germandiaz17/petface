import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { put, del } from '@vercel/blob'

// Dónde se guardan las fotos subidas:
//  - En Vercel (si existe BLOB_READ_WRITE_TOKEN): Vercel Blob, porque el disco de Vercel no es permanente.
//  - En local: la carpeta server/uploads, servida en /uploads.
export const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')
export const UPLOADS_URL = '/uploads'

const usaBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

// En Vercel sin Blob configurado no hay dónde guardar fotos
export const subidasDisponibles = () => usaBlob() || !process.env.VERCEL

// Guarda la imagen y devuelve la URL pública
export async function guardarFoto(nombre, buffer, tipo) {
  if (usaBlob()) {
    const blob = await put(`mascotas/${nombre}`, buffer, { access: 'public', contentType: tipo })
    return blob.url
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOADS_DIR, nombre), buffer)
  return `${UPLOADS_URL}/${nombre}`
}

// Borra una foto subida. Las de /img/... (fotos de ejemplo del front) y las URLs externas no se tocan.
export async function borrarFotoSubida(url) {
  if (!url) return
  if (url.startsWith(`${UPLOADS_URL}/`)) {
    await fs.unlink(path.join(UPLOADS_DIR, path.basename(url))).catch(() => {})
  } else if (usaBlob() && /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url)) {
    await del(url).catch((err) => console.error('No se pudo borrar la foto de Blob:', err.message))
  }
}
