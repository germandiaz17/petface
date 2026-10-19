// Campo de formulario con label y mensaje de error.
// Por defecto es un <input>; con como="select" o como="textarea" cambia el elemento.
export function Campo({ id, label, opcional = false, error, ayuda, como = 'input', children, ...props }) {
  const Elemento = como
  const describedBy = error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined
  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label htmlFor={id}>
        {label} {opcional && <small>(opcional)</small>}
      </label>
      <Elemento id={id} aria-invalid={!!error} aria-describedby={describedBy} {...props}>
        {children}
      </Elemento>
      {error ? (
        <span id={`${id}-error`} className="campo__error">{error}</span>
      ) : (
        ayuda && <span id={`${id}-ayuda`} className="campo__ayuda">{ayuda}</span>
      )}
    </div>
  )
}
