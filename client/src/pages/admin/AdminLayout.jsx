import { NavLink, Outlet } from 'react-router-dom'
import './admin.css'

const TABS = [
  { to: '/admin', texto: 'Resumen', end: true },
  { to: '/admin/mascotas', texto: 'Mascotas' },
  { to: '/admin/solicitudes', texto: 'Solicitudes' },
  { to: '/admin/testimonios', texto: 'Testimonios' },
  { to: '/admin/donaciones', texto: 'Donaciones' },
]

export function AdminLayout() {
  return (
    <div className="contenedor">
      <div className="titulo-pagina">
        <h1>Panel de administración</h1>
        <p>Gestiona mascotas, solicitudes y contenido del sitio.</p>
      </div>
      <nav className="admin__tabs" aria-label="Secciones del panel">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className="admin__tab">{t.texto}</NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
