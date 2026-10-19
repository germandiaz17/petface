import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Carpeta donde se guardan las fotos subidas: server/uploads
export const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')
export const UPLOADS_URL = '/uploads'

// Borra una foto subida si la URL apunta a /uploads (las de /img/... son del front y no se tocan)
export async function borrarFotoSubida(url) {
  if (!url?.startsWith(`${UPLOADS_URL}/`)) return
  const archivo = path.join(UPLOADS_DIR, path.basename(url))
  await fs.unlink(archivo).catch(() => {}) // si ya no existe, no pasa nada
}
