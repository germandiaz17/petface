import { etiqueta } from '../utils/formato'

export function EstadoBadge({ estado }) {
  return <span className={`badge badge--${estado}`}>{etiqueta('estado', estado)}</span>
}
