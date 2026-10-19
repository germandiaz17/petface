import { Link } from 'react-router-dom'
import { Vacio } from '../components/Estados'

export function NoEncontrada() {
  return (
    <div className="contenedor seccion">
      <Vacio titulo="Página no encontrada" accion={<Link to="/" className="btn">Volver al inicio</Link>}>
        La página que buscas no existe o fue movida.
      </Vacio>
    </div>
  )
}
