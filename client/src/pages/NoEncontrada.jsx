import { Link } from 'react-router-dom'
import { useTitulo } from '../hooks/useTitulo'
import { Huella } from '../components/Huella'
import './noencontrada.css'

export function NoEncontrada() {
  useTitulo('Página no encontrada')
  return (
    <div className="contenedor no-encontrada">
      <p className="no-encontrada__codigo" aria-hidden="true">4<Huella tamano="0.9em" />4</p>
      <h1>Esta página se escapó</h1>
      <p>La página que buscas no existe o fue movida. Pero hay muchas mascotas esperando conocerte.</p>
      <div className="no-encontrada__acciones">
        <Link to="/" className="btn btn--secundario">Volver al inicio</Link>
        <Link to="/adopta" className="btn">Ver mascotas</Link>
      </div>
    </div>
  )
}
