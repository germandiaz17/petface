import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import './auth.css'

// Estructura compartida por Login y Registro: panel con foto + formulario
export function AuthLayout({ titulo, subtitulo, children }) {
  return (
    <main className="auth">
      <aside className="auth__panel">
        <Logo claro />
        <div>
          <h2>Cada mascota merece un hogar.</h2>
          <p>Únete a PetFace y encuentra a tu nuevo compañero de vida.</p>
          <ul className="auth__beneficios">
            <li>Conoce a las mascotas disponibles</li>
            <li>Solicita una adopción en minutos</li>
            <li>Sigue el estado de tus solicitudes</li>
          </ul>
        </div>
        <small>© {new Date().getFullYear()} PetFace</small>
      </aside>

      <section className="auth__contenido">
        <div className="auth__card">
          <Logo />
          <div>
            <Link to="/" className="auth__volver">← Volver al inicio</Link>
          </div>
          <h1>{titulo}</h1>
          <p className="auth__sub">{subtitulo}</p>
          {children}
        </div>
      </section>
    </main>
  )
}
