import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { Logo } from '../Logo'
import { Campana } from './Campana'
import './navbar.css'

const ENLACES = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/adopta', texto: 'Adopta' },
  { to: '/donar', texto: 'Donar' },
  { to: '/nosotros', texto: 'Nosotros' },
]

export function Navbar() {
  const { user, esAdmin, logout } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Cierra el menú móvil al cambiar de página
  useEffect(() => {
    setAbierto(false)
  }, [location.pathname])

  const salir = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="contenedor navbar__fila">
        <Link to="/" className="navbar__marca" aria-label="PetFace, inicio">
          <Logo />
        </Link>

        {user && (
          <div className="navbar__campana">
            <Campana />
          </div>
        )}

        <button
          className="navbar__toggle"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          aria-controls="menu-principal"
        >
          <span className="sr-only">Menú</span>
          <span aria-hidden="true">{abierto ? '✕' : '☰'}</span>
        </button>

        <nav id="menu-principal" className={`navbar__menu ${abierto ? 'navbar__menu--abierto' : ''}`}>
          <ul className="navbar__enlaces">
            {ENLACES.map((e) => (
              <li key={e.to}>
                <NavLink to={e.to} end={e.end} className="navbar__enlace">{e.texto}</NavLink>
              </li>
            ))}
            {esAdmin && (
              <li>
                <NavLink to="/admin" className="navbar__enlace navbar__enlace--admin">Admin</NavLink>
              </li>
            )}
          </ul>

          <div className="navbar__cuenta">
            {user ? (
              <>
                <NavLink to="/perfil" className="navbar__usuario">
                  <span className="navbar__avatar" aria-hidden="true">{user.nombre[0]?.toUpperCase()}</span>
                  {user.nombre.split(' ')[0]}
                </NavLink>
                <button className="btn btn--fantasma btn--sm" onClick={salir}>Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" state={{ from: location.pathname }} className="btn btn--fantasma btn--sm">Iniciar sesión</Link>
                <Link to="/registro" state={{ from: location.pathname }} className="btn btn--sm">Registrarse</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
