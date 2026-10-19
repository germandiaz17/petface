import { useState } from 'react'

// Input de contraseña con botón para mostrar/ocultar
export function CampoPassword({ id, label, ayuda, error, ...props }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="campo__input">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          data-con-ojo
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined}
          {...props}
        />
        <button
          type="button"
          className="campo__ojo"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {error ? (
        <span id={`${id}-error`} className="campo__error">{error}</span>
      ) : (
        ayuda && <span id={`${id}-ayuda`} className="campo__ayuda">{ayuda}</span>
      )}
    </div>
  )
}
