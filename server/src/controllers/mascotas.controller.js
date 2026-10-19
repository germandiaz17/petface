import * as Mascota from '../models/mascota.model.js'
import { HttpError } from '../utils/httpError.js'
import { borrarFotoSubida } from '../config/uploads.js'
import * as v from '../utils/validar.js'

// CONTROLADOR Mascotas: valida la petición, llama al modelo y responde.

const ESPECIES = ['perro', 'gato', 'otro']
const GENEROS = ['macho', 'hembra']
const TAMANOS = ['pequeño', 'mediano', 'grande']
const ESTADOS = ['disponible', 'en_proceso', 'adoptada']

function validarMascota(body) {
  return {
    nombre: v.texto(body.nombre, 'nombre', { requerido: true, max: 80 }),
    especie: v.opcion(body.especie, 'especie', ESPECIES, { requerido: true }),
    raza: v.texto(body.raza, 'raza', { max: 80 }),
    edad_meses: v.entero(body.edad_meses, 'edad_meses'),
    genero: v.opcion(body.genero, 'genero', GENEROS, { requerido: true }),
    tamano: v.opcion(body.tamano, 'tamano', TAMANOS),
    descripcion: v.texto(body.descripcion, 'descripcion', { max: 2000 }),
    foto_url: v.texto(body.foto_url, 'foto_url'),
    estado: v.opcion(body.estado, 'estado', ESTADOS),
  }
}

// GET /api/mascotas?especie=&genero=&tamano=&estado=&q=
export async function listar(req, res) {
  const filtros = {
    especie: v.opcion(req.query.especie, 'especie', ESPECIES),
    genero: v.opcion(req.query.genero, 'genero', GENEROS),
    tamano: v.opcion(req.query.tamano, 'tamano', TAMANOS),
    estado: v.opcion(req.query.estado, 'estado', ESTADOS),
    q: v.texto(req.query.q, 'q', { max: 80 }),
  }
  res.json(await Mascota.findAll(filtros))
}

// GET /api/mascotas/:id
export async function obtener(req, res) {
  const mascota = await Mascota.findById(v.id(req.params.id))
  if (!mascota) throw new HttpError(404, 'Mascota no encontrada')
  res.json(mascota)
}

// POST /api/mascotas  (admin)
export async function crear(req, res) {
  const datos = validarMascota(req.body ?? {})
  datos.estado ??= 'disponible'
  res.status(201).json(await Mascota.create(datos))
}

// PUT /api/mascotas/:id  (admin)
export async function actualizar(req, res) {
  const id = v.id(req.params.id)
  const actual = await Mascota.findById(id)
  if (!actual) throw new HttpError(404, 'Mascota no encontrada')

  const datos = validarMascota(req.body ?? {})
  datos.estado ??= actual.estado // si no se envía, se conserva
  const actualizada = await Mascota.update(id, datos)
  // Si se cambió la foto, la anterior (si era subida) ya no se usa
  if (actual.foto_url !== actualizada.foto_url) await borrarFotoSubida(actual.foto_url)
  res.json(actualizada)
}

// DELETE /api/mascotas/:id  (admin)
export async function eliminar(req, res) {
  const id = v.id(req.params.id)
  const mascota = await Mascota.findById(id)
  if (!mascota) throw new HttpError(404, 'Mascota no encontrada')
  await Mascota.remove(id)
  await borrarFotoSubida(mascota.foto_url)
  res.status(204).end()
}
