import * as Solicitud from '../models/solicitud.model.js'
import { HttpError } from '../utils/httpError.js'
import * as v from '../utils/validar.js'

// CONTROLADOR Solicitudes de adopción

// POST /api/solicitudes  (usuario)
export async function crear(req, res) {
  const body = req.body ?? {}
  const solicitud = await Solicitud.create({
    usuario_id: req.user.id,
    mascota_id: v.entero(body.mascota_id, 'mascota_id', { requerido: true, min: 1 }),
    mensaje: v.texto(body.mensaje, 'mensaje', { max: 1000 }),
    telefono_contacto: v.texto(body.telefono_contacto, 'telefono_contacto', { requerido: true, max: 30 }),
  })
  res.status(201).json(solicitud)
}

// GET /api/solicitudes/mias  (usuario)
export async function mias(req, res) {
  res.json(await Solicitud.findByUsuario(req.user.id))
}

// DELETE /api/solicitudes/:id  (usuario, solo las suyas y pendientes)
export async function cancelar(req, res) {
  await Solicitud.cancelar(v.id(req.params.id), req.user.id)
  res.status(204).end()
}

// GET /api/solicitudes?estado=  (admin)
export async function listar(req, res) {
  const estado = v.opcion(req.query.estado, 'estado', ['pendiente', 'aprobada', 'rechazada'])
  res.json(await Solicitud.findAll({ estado }))
}

// PATCH /api/solicitudes/:id  { estado: 'aprobada' | 'rechazada' }  (admin)
export async function cambiarEstado(req, res) {
  const id = v.id(req.params.id)
  const estado = v.opcion(req.body?.estado, 'estado', ['aprobada', 'rechazada'], { requerido: true })
  await Solicitud.cambiarEstado(id, estado)
  const actualizada = await Solicitud.findById(id)
  if (!actualizada) throw new HttpError(404, 'Solicitud no encontrada')
  res.json(actualizada)
}
