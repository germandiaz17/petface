import * as Notificacion from '../models/notificacion.model.js'
import { INSTANCIA } from '../config/seguridad.js'

// CONTROLADOR de notificaciones del usuario conectado

// GET /notif/notificaciones → { no_leidas, notificaciones }
export async function listar(req, res) {
  const [notificaciones, no_leidas] = await Promise.all([
    Notificacion.delUsuario(req.user),
    Notificacion.contarNoLeidas(req.user),
  ])
  res.json({ no_leidas, notificaciones })
}

// PATCH /notif/notificaciones/leidas
export async function marcarLeidas(req, res) {
  await Notificacion.marcarLeidas(req.user)
  res.status(204).end()
}

// GET /notif/health
export function salud(req, res) {
  res.json({ servicio: 'notificaciones', instancia: INSTANCIA, estado: 'ok' })
}
