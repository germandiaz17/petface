import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast'
import './toast.css'

// Mensajes cortos que aparecen abajo a la derecha y se van solos
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const mostrar = useCallback((tipo, mensaje) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, tipo, mensaje }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const valor = useMemo(
    () => ({
      exito: (m) => mostrar('exito', m),
      error: (m) => mostrar('error', m),
    }),
    [mostrar],
  )

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tipo}`}>
            {t.tipo === 'exito' ? '✓' : '!'} <span>{t.mensaje}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
