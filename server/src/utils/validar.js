import { HttpError } from './httpError.js'

// Validadores sencillos. Cada uno devuelve el valor limpio o lanza un HttpError 400.

export function texto(valor, campo, { requerido = false, max = 255 } = {}) {
  if (valor === undefined || valor === null || String(valor).trim() === '') {
    if (requerido) throw new HttpError(400, `El campo "${campo}" es obligatorio`)
    return null
  }
  const limpio = String(valor).trim()
  if (limpio.length > max) {
    throw new HttpError(400, `El campo "${campo}" admite máximo ${max} caracteres`)
  }
  return limpio
}

export function opcion(valor, campo, opciones, { requerido = false } = {}) {
  const limpio = texto(valor, campo, { requerido })
  if (limpio === null) return null
  if (!opciones.includes(limpio)) {
    throw new HttpError(400, `"${campo}" debe ser uno de: ${opciones.join(', ')}`)
  }
  return limpio
}

export function entero(valor, campo, { requerido = false, min = 0 } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw new HttpError(400, `El campo "${campo}" es obligatorio`)
    return null
  }
  const n = Number(valor)
  if (!Number.isInteger(n) || n < min) {
    throw new HttpError(400, `"${campo}" debe ser un número entero mayor o igual a ${min}`)
  }
  return n
}

export function numero(valor, campo, { requerido = false, min = 0 } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw new HttpError(400, `El campo "${campo}" es obligatorio`)
    return null
  }
  const n = Number(valor)
  if (!Number.isFinite(n) || n <= min) {
    throw new HttpError(400, `"${campo}" debe ser un número mayor que ${min}`)
  }
  return n
}

export function email(valor, campo = 'email', { requerido = true } = {}) {
  const limpio = texto(valor, campo, { requerido, max: 150 })
  if (limpio === null) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    throw new HttpError(400, 'El email no es válido')
  }
  return limpio.toLowerCase()
}

// Para el :id de la URL
export function id(valor) {
  const n = Number(valor)
  if (!Number.isInteger(n) || n < 1) throw new HttpError(400, 'Id inválido')
  return n
}
