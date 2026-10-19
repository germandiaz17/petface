import { Link } from 'react-router-dom'
import { Logo } from '../Logo'
import './footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer__grid">
        <div>
          <Logo claro />
          <p>Organización dedicada a encontrar hogares amorosos para animales domésticos en necesidad.</p>
        </div>
        <div>
          <h3>Explora</h3>
          <ul>
            <li><Link to="/adopta">Mascotas en adopción</Link></li>
            <li><Link to="/donar">Haz una donación</Link></li>
            <li><Link to="/nosotros">Sobre nosotros</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <ul>
            <li>contacto@petface.com</li>
            <li>+57 300 000 0000</li>
            <li>Carrera 10 No 26 – 51</li>
          </ul>
        </div>
      </div>
      <div className="contenedor footer__bajo">
        © {new Date().getFullYear()} PetFace · Proyecto universitario
      </div>
    </footer>
  )
}
