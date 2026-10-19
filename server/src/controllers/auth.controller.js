import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as Usuario from '../models/usuario.model.js'
import { JWT_SECRET } from '../middlewares/auth.js'
import { HttpError } from '../utils/httpError.js'
import * as v from '../utils/validar.js'

// CONTROLADOR Auth: registro, login, logout y sesión actual.

const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000

// Crea el JWT y lo guarda en una cookie httpOnly (JavaScript del navegador no puede leerla)
function iniciarSesion(res, usuario) {
  const { id, nombre, email, rol } = usuario
  const token = jwt.sign({ id, nombre, email, rol }, JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SIETE_DIAS_MS,
  })
}

// Quita password_hash antes de responder
const publico = ({ password_hash, ...resto }) => resto // eslint-disable-line no-unused-vars

// POST /api/auth/registro
export async function registro(req, res) {
  const body = req.body ?? {}
  const nombre = v.texto(body.nombre, 'nombre', { requerido: true, max: 100 })
  const email = v.email(body.email)
  const telefono = v.texto(body.telefono, 'telefono', { max: 30 })
  const password = typeof body.password === 'string' ? body.password : ''
  if (password.length < 8) throw new HttpError(400, 'La contraseña debe tener al menos 8 caracteres')
  if (password.length > 72) throw new HttpError(400, 'La contraseña admite máximo 72 caracteres')

  if (await Usuario.existeEmail(email)) throw new HttpError(409, 'Ya existe una cuenta con ese email')

  const password_hash = await bcrypt.hash(password, 10)
  const usuario = await Usuario.create({ nombre, email, password_hash, telefono })
  iniciarSesion(res, usuario)
  res.status(201).json(usuario)
}

// POST /api/auth/login
export async function login(req, res) {
  const email = v.email(req.body?.email)
  const password = typeof req.body?.password === 'string' ? req.body.password : ''

  const usuario = await Usuario.findByEmailConPassword(email)
  // Mismo mensaje si falla el email o la contraseña: no revelamos qué emails existen
  if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
    throw new HttpError(401, 'Email o contraseña incorrectos')
  }
  iniciarSesion(res, usuario)
  res.json(publico(usuario))
}

// POST /api/auth/logout
export function logout(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  res.status(204).end()
}

// GET /api/auth/me → el usuario de la sesión actual (lo usa React al recargar la página)
export async function me(req, res) {
  const usuario = await Usuario.findById(req.user.id)
  if (!usuario) throw new HttpError(401, 'La sesión ya no es válida')
  res.json(usuario)
}
