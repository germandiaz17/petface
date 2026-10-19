import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { CLAVE_INTERNA, JWT_SECRET } from '../config/seguridad.js'

// Usuarios: valida el mismo JWT que emite la API (cookie "token")
export function requireAuth(req, res, next) {
  try {
    const { id, nombre, rol } = jwt.verify(req.cookies?.token ?? '', JWT_SECRET)
    req.user = { id, nombre, rol }
    next()
  } catch {
    res.status(401).json({ error: 'Debes iniciar sesión' })
  }
}

// Servicio a servicio: solo quien conoce la clave interna puede enviar eventos
export function requireClaveInterna(req, res, next) {
  const clave = Buffer.from(req.get('x-clave-interna') ?? '')
  const esperada = Buffer.from(CLAVE_INTERNA)
  if (clave.length === esperada.length && crypto.timingSafeEqual(clave, esperada)) return next()
  res.status(401).json({ error: 'Clave interna inválida' })
}
