import jwt from 'jsonwebtoken'
import { HttpError } from '../utils/httpError.js'

export const JWT_SECRET = process.env.JWT_SECRET ?? 'secreto-solo-para-desarrollo'
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET no está definido en server/.env; usando un valor de desarrollo.')
}

// Lee el token (cookie "token" o cabecera "Authorization: Bearer ...")
// y, si es válido, deja los datos del usuario en req.user. No bloquea.
export function cargarUsuario(req, res, next) {
  const header = req.get('authorization')
  const token = req.cookies?.token ?? (header?.startsWith('Bearer ') ? header.slice(7) : null)
  if (token) {
    try {
      const { id, nombre, email, rol } = jwt.verify(token, JWT_SECRET)
      req.user = { id, nombre, email, rol }
    } catch {
      // token vencido o alterado: se trata como visitante
    }
  }
  next()
}

// Exige haber iniciado sesión
export function requireAuth(req, res, next) {
  if (!req.user) throw new HttpError(401, 'Debes iniciar sesión')
  next()
}

// Exige rol admin
export function requireAdmin(req, res, next) {
  if (!req.user) throw new HttpError(401, 'Debes iniciar sesión')
  if (req.user.rol !== 'admin') throw new HttpError(403, 'No tienes permiso para esta acción')
  next()
}
