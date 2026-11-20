import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../services/api'

// Carga datos de la API: const { datos, cargando, error, recargar, refrescar } = useApi('/mascotas')
// Si ruta es null no hace nada (útil cuando depende de que haya sesión).
// - recargar(): vuelve a pedir los datos mostrando "cargando".
// - refrescar(): los vuelve a pedir sin parpadeo (para cambios que llegan en vivo).
export function useApi(ruta) {
  const [estado, setEstado] = useState({ datos: null, cargando: Boolean(ruta), error: null })
  const [version, setVersion] = useState(0)
  const silencioso = useRef(false)

  useEffect(() => {
    if (!ruta) {
      setEstado({ datos: null, cargando: false, error: null })
      return
    }
    let activo = true
    const sinParpadeo = silencioso.current
    silencioso.current = false
    if (!sinParpadeo) setEstado((e) => ({ ...e, cargando: true, error: null }))
    api
      .get(ruta)
      .then((datos) => activo && setEstado({ datos, cargando: false, error: null }))
      .catch((error) => activo && setEstado({ datos: null, cargando: false, error }))
    return () => {
      activo = false
    }
  }, [ruta, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])
  const refrescar = useCallback(() => {
    silencioso.current = true
    setVersion((v) => v + 1)
  }, [])
  return { ...estado, recargar, refrescar }
}
