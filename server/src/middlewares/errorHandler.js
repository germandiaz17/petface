// Manejador central de errores: cualquier error lanzado en un controlador llega aquí.
// Express 5 captura también los errores de funciones async.

// Códigos de error de PostgreSQL → respuesta HTTP entendible
const ERRORES_PG = {
  23505: [409, 'Ya existe un registro con esos datos'], // unique_violation
  23503: [400, 'El registro relacionado no existe'], // foreign_key_violation
  23514: [400, 'Algún valor no es válido'], // check_violation
  '22P02': [400, 'Formato de dato inválido'], // invalid_text_representation
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'La imagen supera el tamaño máximo de 4 MB' })
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: 'No se pudo procesar el archivo enviado' })
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' })
  }
  if (ERRORES_PG[err.code]) {
    const [status, mensaje] = ERRORES_PG[err.code]
    return res.status(status).json({ error: mensaje })
  }
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
