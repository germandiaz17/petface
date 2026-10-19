import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'

// Carga datos de la API: const { datos, cargando, error, recargar } = useApi('/mascotas')
// Si ruta es null no hace nada (útil cuando depende de que haya sesión).
export function useApi(ruta) {
  const [estado, setEstado] = useState({ datos: null, cargando: Boolean(ruta), error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!ruta) {
      setEstado({ datos: null, cargando: false, error: null })
      return
    }
    let activo = true
    setEstado((e) => ({ ...e, cargando: true, error: null }))
    api
      .get(ruta)
      .then((datos) => activo && setEstado({ datos, cargando: false, error: null }))
      .catch((error) => activo && setEstado({ datos: null, cargando: false, error }))
    return () => {
      activo = false
    }
  }, [ruta, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])
  return { ...estado, recargar }
}
