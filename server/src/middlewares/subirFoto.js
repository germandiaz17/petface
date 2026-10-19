import crypto from 'node:crypto'
import multer from 'multer'
import { UPLOADS_DIR } from '../config/uploads.js'
import { HttpError } from '../utils/httpError.js'

export const TIPOS_PERMITIDOS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
export const TAMANO_MAXIMO = 5 * 1024 * 1024 // 5 MB

// Recibe un archivo del campo "foto" (multipart/form-data) y lo guarda con un nombre aleatorio
export const subirFoto = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + TIPOS_PERMITIDOS[file.mimetype]),
  }),
  limits: { fileSize: TAMANO_MAXIMO, files: 1 },
  fileFilter: (req, file, cb) => {
    if (TIPOS_PERMITIDOS[file.mimetype]) cb(null, true)
    else cb(new HttpError(400, 'Solo se permiten imágenes JPG, PNG o WEBP'))
  },
}).single('foto')
