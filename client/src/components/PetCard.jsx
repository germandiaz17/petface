import { Link } from 'react-router-dom'
import { EstadoBadge } from './EstadoBadge'
import { edadTexto, etiqueta, FOTO_POR_DEFECTO } from '../utils/formato'
import './petcard.css'

// Tarjeta de mascota para los listados. Toda la tarjeta lleva al detalle.
export function PetCard({ mascota }) {
  const { id, nombre, especie, raza, edad_meses, genero, foto_url, estado } = mascota
  return (
    <Link to={`/mascotas/${id}`} className="petcard">
      <div className="petcard__foto">
        <img
          src={foto_url || FOTO_POR_DEFECTO}
          alt={`Foto de ${nombre}`}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FOTO_POR_DEFECTO)}
        />
        <span className="petcard__estado"><EstadoBadge estado={estado} /></span>
      </div>
      <div className="petcard__cuerpo">
        <h3>{nombre}</h3>
        <p className="petcard__raza">{raza || etiqueta('especie', especie)}</p>
        <ul className="chips">
          <li>{etiqueta('especie', especie)}</li>
          <li>{edadTexto(edad_meses)}</li>
          <li>{etiqueta('genero', genero)}</li>
        </ul>
      </div>
    </Link>
  )
}
