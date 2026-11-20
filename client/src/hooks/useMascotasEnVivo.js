import { useEffect, useRef, useState } from 'react'

const VERBOS = { INSERT: 'fue creada', UPDATE: 'fue actualizada', DELETE: 'fue eliminada' }

// Texto para mostrar un cambio: "Luna fue actualizada por api-1 (entregado por api-2)"
export function describirCambio(c) {
  const quien = c.origen || 'la base de datos' // api-1, api-2… o "psql" si se cambió a mano
  return `${c.nombre} ${VERBOS[c.operacion] ?? 'cambió'} por ${quien} · entregado por ${c.entregadoPor}`
}

// Escucha en vivo los cambios de la tabla "mascotas" (Server-Sent Events).
// alCambiar(cambio) se llama con { operacion, id, nombre, estado, origen, entregadoPor }.
// Devuelve { conectado, instancia }: instancia = réplica que mantiene esta conexión abierta.
export function useMascotasEnVivo(alCambiar) {
  const [estado, setEstado] = useState({ conectado: false, instancia: null })
  const callback = useRef(alCambiar)
  callback.current = alCambiar

  useEffect(() => {
    if (typeof EventSource === 'undefined') return
    // EventSource reintenta solo si se corta la conexión (por ejemplo, si cae una réplica)
    const fuente = new EventSource('/api/mascotas/eventos', { withCredentials: true })
    fuente.addEventListener('conectado', (e) => {
      setEstado({ conectado: true, instancia: JSON.parse(e.data).instancia })
    })
    fuente.addEventListener('cambio', (e) => callback.current?.(JSON.parse(e.data)))
    fuente.onerror = () => setEstado((s) => ({ ...s, conectado: false }))
    return () => fuente.close()
  }, [])

  return estado
}
