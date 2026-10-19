// Error con código HTTP. Lanzarlo en un controlador o modelo:
//   throw new HttpError(404, 'Mascota no encontrada')
// y el middleware errorHandler responde con ese código y mensaje.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
