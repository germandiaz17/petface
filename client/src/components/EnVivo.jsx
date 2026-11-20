import './envivo.css'

// Indicador "● En vivo": muestra si la página recibe cambios al instante y desde qué réplica
export function EnVivo({ conectado, instancia }) {
  return (
    <span className={`en-vivo ${conectado ? 'en-vivo--on' : ''}`} title="Los cambios en las mascotas aparecen sin recargar">
      <span className="en-vivo__punto" aria-hidden="true" />
      {conectado ? `En vivo · conectado a ${instancia}` : 'Conectando en vivo…'}
    </span>
  )
}
