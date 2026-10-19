import multer from 'multer'
import { HttpError } from '../utils/httpError.js'

export const TIPOS_PERMITIDOS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
// Vercel limita el cuerpo de las peticiones a 4,5 MB: dejamos 4 MB para las fotos
export const TAMANO_MAXIMO_MB = 4

// Recibe un archivo del campo "foto" (multipart/form-data) y lo deja en memoria (req.file.buffer);
// el controlador decide dónde guardarlo después de verificarlo.
export const subirFoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANO_MAXIMO_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (TIPOS_PERMITIDOS[file.mimetype]) cb(null, true)
    else cb(new HttpError(400, 'Solo se permiten imágenes JPG, PNG o WEBP'))
  },
}).single('foto')
