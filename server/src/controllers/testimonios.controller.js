import * as Testimonio from '../models/testimonio.model.js'
import { HttpError } from '../utils/httpError.js'
import * as v from '../utils/validar.js'

// CONTROLADOR Testimonios

// GET /api/testimonios  (público: solo aprobados)
export async function listarAprobados(req, res) {
  res.json(await Testimonio.findAprobados())
}

// GET /api/testimonios/todos  (admin)
export async function listarTodos(req, res) {
  res.json(await Testimonio.findAll())
}

// POST /api/testimonios  (usuario) → queda pendiente de aprobación
export async function crear(req, res) {
  const testimonio = await Testimonio.create({
    usuario_id: req.user.id,
    autor: req.user.nombre,
    texto: v.texto(req.body?.texto, 'texto', { requerido: true, max: 1000 }),
  })
  res.status(201).json(testimonio)
}

// PATCH /api/testimonios/:id  { aprobado: true|false }  (admin)
export async function aprobar(req, res) {
  const aprobado = req.body?.aprobado
  if (typeof aprobado !== 'boolean') throw new HttpError(400, '"aprobado" debe ser true o false')
  const testimonio = await Testimonio.setAprobado(v.id(req.params.id), aprobado)
  if (!testimonio) throw new HttpError(404, 'Testimonio no encontrado')
  res.json(testimonio)
}

// DELETE /api/testimonios/:id  (admin)
export async function eliminar(req, res) {
  const borrado = await Testimonio.remove(v.id(req.params.id))
  if (!borrado) throw new HttpError(404, 'Testimonio no encontrado')
  res.status(204).end()
}
