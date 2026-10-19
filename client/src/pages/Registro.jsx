import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { AuthLayout } from './AuthLayout'
import { Campo } from '../components/Campo'
import { CampoPassword } from '../components/CampoPassword'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VACIO = { nombre: '', email: '', telefono: '', password: '', confirmar: '' }

export function Registro() {
  const { user, registro } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from ?? '/'

  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (user) return <Navigate to={destino} replace />

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: undefined })
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Escribe tu nombre'
    if (!form.email.trim()) e.email = 'Escribe tu email'
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'El email no es válido'
    if (form.password.length < 8) e.password = 'Debe tener al menos 8 caracteres'
    if (form.confirmar !== form.password) e.confirmar = 'Las contraseñas no coinciden'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')
    if (!validar()) return
    setEnviando(true)
    try {
      await registro({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || undefined,
        password: form.password,
      })
      navigate(destino, { replace: true })
    } catch (err) {
      if (err.status === 409) setErrores({ email: err.message })
      else setErrorGeneral(err.message)
      setEnviando(false)
    }
  }

  return (
    <AuthLayout titulo="Crea tu cuenta" subtitulo="Solo te tomará un minuto.">
      <form className="auth__form" onSubmit={enviar} noValidate>
        {errorGeneral && <div className="auth__alerta" role="alert">{errorGeneral}</div>}
        <Campo
          id="nombre" name="nombre" label="Nombre completo" autoComplete="name" autoFocus
          value={form.nombre} onChange={cambiar} error={errores.nombre}
        />
        <Campo
          id="email" name="email" type="email" label="Email" autoComplete="email"
          value={form.email} onChange={cambiar} error={errores.email}
        />
        <Campo
          id="telefono" name="telefono" type="tel" label="Teléfono" opcional autoComplete="tel"
          value={form.telefono} onChange={cambiar} error={errores.telefono}
        />
        <CampoPassword
          id="password" name="password" label="Contraseña" autoComplete="new-password"
          ayuda="Mínimo 8 caracteres." value={form.password} onChange={cambiar} error={errores.password}
        />
        <CampoPassword
          id="confirmar" name="confirmar" label="Confirmar contraseña" autoComplete="new-password"
          value={form.confirmar} onChange={cambiar} error={errores.confirmar}
        />
        <button className="auth__boton" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth__pie">
        ¿Ya tienes cuenta? <Link to="/login" state={location.state}>Inicia sesión</Link>
      </p>
    </AuthLayout>
  )
}
