import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

// Estructura de las páginas públicas: navbar + contenido + footer
export function Layout() {
  const { pathname } = useLocation()
  // cada página empieza arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="layout">
      <a href="#contenido" className="saltar">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" className="layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
