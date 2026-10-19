// Input con label y mensaje de error
export function Campo({ id, label, opcional = false, error, ...props }) {
  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label htmlFor={id}>
        {label} {opcional && <small>(opcional)</small>}
      </label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <span id={`${id}-error`} className="campo__error">{error}</span>}
    </div>
  )
}
