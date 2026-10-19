// Estados de pantalla reutilizables: cargando, error y vacío

export function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className="estado" aria-busy="true">
      <div className="spinner" />
      <p>{texto}</p>
    </div>
  )
}

export function ErrorCarga({ error, onReintentar }) {
  return (
    <div className="estado">
      <h3>No pudimos cargar la información</h3>
      <p>{error?.message ?? 'Ocurrió un error inesperado.'}</p>
      {onReintentar && (
        <button className="btn btn--secundario" onClick={onReintentar}>Reintentar</button>
      )}
    </div>
  )
}

export function Vacio({ titulo, children, accion }) {
  return (
    <div className="estado">
      <h3>{titulo}</h3>
      {children && <p>{children}</p>}
      {accion}
    </div>
  )
}
