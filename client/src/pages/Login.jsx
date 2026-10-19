import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { AuthLayout } from './AuthLayout'
import { Campo } from '../components/Campo'
import { CampoPassword } from '../components/CampoPassword'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
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
    if (!form.email.trim()) e.email = 'Escribe tu email'
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'El email no es válido'
    if (!form.password) e.password = 'Escribe tu contraseña'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')
    if (!validar()) return
    setEnviando(true)
    try {
      await login(form.email.trim(), form.password)
      navigate(destino, { replace: true })
    } catch (err) {
      setErrorGeneral(err.message)
      setEnviando(false)
    }
  }

  return (
    <AuthLayout titulo="Bienvenido de nuevo" subtitulo="Inicia sesión para continuar con tu adopción.">
      <form className="auth__form" onSubmit={enviar} noValidate>
        {errorGeneral && <div className="auth__alerta" role="alert">{errorGeneral}</div>}
        <Campo
          id="email" name="email" type="email" label="Email" autoComplete="email" autoFocus
          value={form.email} onChange={cambiar} error={errores.email}
        />
        <CampoPassword
          id="password" name="password" label="Contraseña" autoComplete="current-password"
          value={form.password} onChange={cambiar} error={errores.password}
        />
        <button className="auth__boton" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth__pie">
        ¿No tienes cuenta? <Link to="/registro" state={location.state}>Regístrate</Link>
      </p>

      {import.meta.env.DEV && (
        <div className="auth__demo">
          Cuentas de prueba: <code>admin@petface.com</code> / <code>admin123</code> ·{' '}
          <code>ana@petface.com</code> / <code>ana12345</code>
        </div>
      )}
    </AuthLayout>
  )
}
