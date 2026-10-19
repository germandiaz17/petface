import { useState } from 'react'
import { Modal } from './Modal'

// Diálogo de confirmación. onConfirmar puede ser async; mientras corre, el botón queda deshabilitado.
export function Confirmar({ abierto, onCerrar, onConfirmar, titulo, children, textoConfirmar = 'Confirmar', peligro = false }) {
  const [trabajando, setTrabajando] = useState(false)

  const confirmar = async () => {
    setTrabajando(true)
    try {
      await onConfirmar()
      onCerrar()
    } finally {
      setTrabajando(false)
    }
  }

  return (
    <Modal abierto={abierto} onCerrar={trabajando ? () => {} : onCerrar} titulo={titulo}>
      <div>{children}</div>
      <div className="modal__acciones">
        <button className="btn btn--secundario" onClick={onCerrar} disabled={trabajando}>Cancelar</button>
        <button className={`btn ${peligro ? 'btn--peligro' : ''}`} onClick={confirmar} disabled={trabajando}>
          {trabajando ? 'Procesando…' : textoConfirmar}
        </button>
      </div>
    </Modal>
  )
}
