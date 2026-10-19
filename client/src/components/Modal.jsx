import { useEffect } from 'react'
import './modal.css'

// Ventana modal accesible: se cierra con Esc o haciendo clic fuera.
export function Modal({ abierto, onCerrar, titulo, children, ancho = 480 }) {
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', alPresionar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" style={{ maxWidth: ancho }}>
        <div className="modal__cabecera">
          <h2 id="modal-titulo">{titulo}</h2>
          <button className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
