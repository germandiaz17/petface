import * as Notificacion from '../models/notificacion.model.js'

// CONTROLADOR de eventos: la API principal avisa "pasó X" y aquí se decide
// a quién notificar y con qué texto. La API no sabe nada de notificaciones.
const PLANTILLAS = {
  'solicitud.creada': (d) => ({
    rol_destino: 'admin',
    titulo: 'Nueva solicitud de adopción',
    mensaje: `${d.usuario_nombre} quiere adoptar a ${d.mascota_nombre}.`,
    enlace: '/admin/solicitudes',
  }),
  'solicitud.aprobada': (d) => ({
    usuario_id: d.usuario_id,
    titulo: '¡Tu solicitud fue aprobada! 🎉',
    mensaje: `Aprobamos tu solicitud para adoptar a ${d.mascota_nombre}. Te contactaremos pronto.`,
    enlace: `/mascotas/${d.mascota_id}`,
  }),
  'solicitud.rechazada': (d) => ({
    usuario_id: d.usuario_id,
    titulo: 'Tu solicitud no fue aprobada',
    mensaje: `Esta vez no pudimos aprobar tu solicitud para ${d.mascota_nombre}. ¡Hay más mascotas esperándote!`,
    enlace: '/adopta',
  }),
  'donacion.recibida': (d) => ({
    rol_destino: 'admin',
    titulo: 'Nueva donación',
    mensaje: `${d.nombre} donó $${Number(d.monto).toLocaleString('es-CO')}.`,
    enlace: '/admin/donaciones',
  }),
  'testimonio.creado': (d) => ({
    rol_destino: 'admin',
    titulo: 'Testimonio por revisar',
    mensaje: `${d.autor} envió un testimonio.`,
    enlace: '/admin/testimonios',
  }),
}

// POST /notif/eventos  { tipo, datos }  (solo la API, con la clave interna)
export async function recibir(req, res) {
  const { tipo, datos } = req.body ?? {}
  const plantilla = PLANTILLAS[tipo]
  if (!plantilla || typeof datos !== 'object' || datos === null) {
    return res.status(400).json({ error: `Evento desconocido: ${tipo}` })
  }
  const notificacion = await Notificacion.crear(plantilla(datos))
  res.status(201).json(notificacion)
}
