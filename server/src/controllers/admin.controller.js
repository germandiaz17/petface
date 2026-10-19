import * as Mascota from '../models/mascota.model.js'
import * as Solicitud from '../models/solicitud.model.js'
import * as Donacion from '../models/donacion.model.js'

// GET /api/admin/resumen  (admin) → contadores para el panel
export async function resumen(req, res) {
  const [mascotas, solicitudes, donaciones] = await Promise.all([
    Mascota.resumen(),
    Solicitud.resumen(),
    Donacion.resumen(),
  ])
  res.json({ mascotas, solicitudes, donaciones })
}
