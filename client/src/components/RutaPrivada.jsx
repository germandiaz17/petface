import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'

// Envuelve páginas que requieren sesión (o rol admin).
//   <RutaPrivada><Perfil /></RutaPrivada>
//   <RutaPrivada soloAdmin><Admin /></RutaPrivada>
export function RutaPrivada({ children, soloAdmin = false }) {
  const { user, cargando } = useAuth()
  const location = useLocation()

  if (cargando) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (soloAdmin && user.rol !== 'admin') return <Navigate to="/" replace />
  return children
}
