// Límite de intentos de login fallidos, guardado en memoria (se reinicia al reiniciar el servidor).
// Evita que alguien pruebe contraseñas sin parar contra una misma cuenta.

export const MAX_INTENTOS = 5
const VENTANA_MS = 15 * 60 * 1000 // 15 minutos

const intentos = new Map() // email → { fallidos, hasta }

// Devuelve los minutos que faltan si la cuenta está bloqueada; si no, 0
export function minutosBloqueado(email) {
  const registro = intentos.get(email)
  if (!registro) return 0
  if (Date.now() > registro.hasta) {
    intentos.delete(email)
    return 0
  }
  return registro.fallidos >= MAX_INTENTOS ? Math.ceil((registro.hasta - Date.now()) / 60000) : 0
}

export function registrarFallo(email) {
  const registro = intentos.get(email)
  if (!registro || Date.now() > registro.hasta) {
    intentos.set(email, { fallidos: 1, hasta: Date.now() + VENTANA_MS })
  } else {
    registro.fallidos += 1
  }
}

export function limpiar(email) {
  intentos.delete(email)
}
