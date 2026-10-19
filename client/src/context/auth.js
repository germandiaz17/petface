import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// Hook para usar la sesión en cualquier componente:
//   const { user, login, logout } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
