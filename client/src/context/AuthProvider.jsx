import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import { api } from '../services/api'

// Guarda el usuario logueado y lo comparte con toda la app.
// La sesión real vive en una cookie httpOnly; al cargar la página se pregunta al backend quién soy.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCargando(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const usuario = await api.post('/auth/login', { email, password })
    setUser(usuario)
    return usuario
  }, [])

  const registro = useCallback(async (datos) => {
    const usuario = await api.post('/auth/registro', datos)
    setUser(usuario)
    return usuario
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {})
    setUser(null)
  }, [])

  const valor = useMemo(
    () => ({ user, cargando, esAdmin: user?.rol === 'admin', login, registro, logout }),
    [user, cargando, login, registro, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
