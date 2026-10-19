// Manejador central de errores: cualquier error lanzado en un controlador llega aquí.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status ?? 500
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : err.message })
}
