// Cliente HTTP para hablar con el backend.
// En desarrollo Vite redirige /api → http://localhost:3000 (ver vite.config.js).

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// base: '/api' (API principal) o '/notif' (microservicio de notificaciones)
async function request(metodo, ruta, body, base = '/api') {
  let res
  try {
    res = await fetch(`${base}${ruta}`, {
      method: metodo,
      credentials: 'include', // envía la cookie de sesión
      // FormData (archivos) lo envía el navegador con su propio Content-Type
      headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : undefined,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  if (res.status === 204) return null
  const datos = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, datos?.error ?? 'Ocurrió un error inesperado')
  return datos
}

// Microservicio de notificaciones: otro servidor, misma sesión (el gateway lo enruta en /notif)
export const notif = {
  get: (ruta) => request('GET', ruta, undefined, '/notif'),
  patch: (ruta) => request('PATCH', ruta, undefined, '/notif'),
}

export const api = {
  get: (ruta) => request('GET', ruta),
  post: (ruta, body) => request('POST', ruta, body),
  put: (ruta, body) => request('PUT', ruta, body),
  patch: (ruta, body) => request('PATCH', ruta, body),
  delete: (ruta) => request('DELETE', ruta),
  // Sube una imagen al backend y devuelve { url }
  subirFoto: (archivo) => {
    const form = new FormData()
    form.append('foto', archivo)
    return request('POST', '/uploads', form)
  },
}
