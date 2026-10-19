// Textos y formatos que se repiten en la app

export const ETIQUETAS = {
  especie: { perro: 'Perro', gato: 'Gato', otro: 'Otro' },
  genero: { macho: 'Macho', hembra: 'Hembra' },
  tamano: { pequeño: 'Pequeño', mediano: 'Mediano', grande: 'Grande' },
  estado: {
    disponible: 'Disponible',
    en_proceso: 'En proceso',
    adoptada: 'Adoptada',
    pendiente: 'Pendiente',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
  },
}

export const etiqueta = (grupo, valor) => ETIQUETAS[grupo]?.[valor] ?? valor ?? '—'

export function edadTexto(meses) {
  if (meses === null || meses === undefined) return 'Edad desconocida'
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  const anios = Math.floor(meses / 12)
  return `${anios} ${anios === 1 ? 'año' : 'años'}`
}

export const fecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

export const dinero = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export const FOTO_POR_DEFECTO = '/img/mascota-sin-foto.svg'
