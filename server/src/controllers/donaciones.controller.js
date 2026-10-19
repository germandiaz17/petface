import * as Donacion from '../models/donacion.model.js'
import * as v from '../utils/validar.js'
import { enviarEvento } from '../services/notificador.js'

// CONTROLADOR Donaciones (simuladas)

// POST /api/donaciones  (público; si hay sesión se asocia al usuario)
export async function crear(req, res) {
  const body = req.body ?? {}
  const donacion = await Donacion.create({
    usuario_id: req.user?.id ?? null,
    nombre: v.texto(body.nombre, 'nombre', { requerido: true, max: 100 }),
    email: v.email(body.email),
    monto: v.numero(body.monto, 'monto', { requerido: true }),
  })
  await enviarEvento('donacion.recibida', donacion)
  res.status(201).json(donacion)
}

// GET /api/donaciones  (admin) → { total, cantidad, donaciones }
export async function listar(req, res) {
  const [resumen, donaciones] = await Promise.all([Donacion.resumen(), Donacion.findAll()])
  res.json({ ...resumen, donaciones })
}
