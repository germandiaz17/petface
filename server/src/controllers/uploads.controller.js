import fs from 'node:fs/promises'
import { UPLOADS_URL } from '../config/uploads.js'
import { HttpError } from '../utils/httpError.js'

// Primeros bytes ("firma") de cada formato: así comprobamos que el archivo
// es de verdad una imagen y no otra cosa renombrada.
const FIRMAS = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (b) => b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP',
}

// POST /api/uploads  (admin, campo "foto") → { url }
export async function subir(req, res) {
  if (!req.file) throw new HttpError(400, 'Selecciona una imagen')

  const archivo = await fs.open(req.file.path)
  const { buffer } = await archivo.read(Buffer.alloc(12), 0, 12, 0)
  await archivo.close()

  if (!FIRMAS[req.file.mimetype](buffer)) {
    await fs.unlink(req.file.path)
    throw new HttpError(400, 'El archivo no es una imagen válida')
  }
  res.status(201).json({ url: `${UPLOADS_URL}/${req.file.filename}` })
}
