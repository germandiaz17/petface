import crypto from 'node:crypto'
import { guardarFoto, subidasDisponibles } from '../config/uploads.js'
import { TIPOS_PERMITIDOS } from '../middlewares/subirFoto.js'
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
  if (!subidasDisponibles()) {
    throw new HttpError(503, 'La subida de fotos no está configurada (falta conectar Vercel Blob)')
  }
  if (!req.file) throw new HttpError(400, 'Selecciona una imagen')
  if (!FIRMAS[req.file.mimetype](req.file.buffer)) {
    throw new HttpError(400, 'El archivo no es una imagen válida')
  }

  // Nombre aleatorio: nunca se usa el nombre que manda el usuario
  const nombre = crypto.randomUUID() + TIPOS_PERMITIDOS[req.file.mimetype]
  const url = await guardarFoto(nombre, req.file.buffer, req.file.mimetype)
  res.status(201).json({ url })
}
