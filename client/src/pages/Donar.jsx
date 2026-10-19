import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth'
import { api } from '../services/api'
import { Campo } from '../components/Campo'
import { dinero } from '../utils/formato'
import './donar.css'

const MONTOS = [10000, 20000, 50000, 100000]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Donar() {
  const { user } = useAuth()
  const [form, setForm] = useState({ nombre: user?.nombre ?? '', email: user?.email ?? '', monto: 20000 })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [gracias, setGracias] = useState(null)

  // La sesión carga de forma asíncrona: cuando llega el usuario, completa los campos vacíos
  useEffect(() => {
    if (!user) return
    setForm((f) => ({ ...f, nombre: f.nombre || user.nombre, email: f.email || user.email }))
  }, [user])

  const cambiar = (campo, valor) => {
    setForm({ ...form, [campo]: valor })
    setErrores({ ...errores, [campo]: undefined })
  }

  const enviar = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'Escribe tu nombre'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Escribe un email válido'
    if (!(Number(form.monto) >= 1000)) errs.monto = 'El monto mínimo es $1.000'
    setErrores(errs)
    if (Object.keys(errs).length) return

    setErrorGeneral('')
    setEnviando(true)
    try {
      const donacion = await api.post('/donaciones', { ...form, monto: Number(form.monto) })
      setGracias(donacion)
    } catch (err) {
      setErrorGeneral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="contenedor">
      <div className="titulo-pagina">
        <h1>Haz una donación</h1>
        <p>Cada aporte, sin importar su tamaño, cambia la vida de un animal.</p>
      </div>

      <div className="donar">
        <div>
          <h2>¿A dónde va tu donación?</h2>
          <ul className="donar__usos">
            <li><strong>🍖 Alimento</strong> de calidad para perros y gatos del refugio.</li>
            <li><strong>💉 Vacunas</strong> y desparasitación antes de cada adopción.</li>
            <li><strong>🩺 Esterilización</strong> y atención veterinaria.</li>
            <li><strong>🏠 Refugio</strong> temporal mientras encuentran familia.</li>
          </ul>
          <div className="alerta alerta--aviso">
            Este es un proyecto universitario: la donación es una <strong>simulación</strong> y no se realiza ningún cobro.
          </div>
        </div>

        <div className="tarjeta">
          {gracias ? (
            <div className="donar__gracias">
              <div className="donar__icono" aria-hidden="true">💚</div>
              <h2>¡Gracias, {gracias.nombre.split(' ')[0]}!</h2>
              <p>Registramos tu donación de <strong>{dinero(gracias.monto)}</strong>.</p>
              <button className="btn btn--secundario" onClick={() => setGracias(null)}>Hacer otra donación</button>
            </div>
          ) : (
            <form className="formulario" onSubmit={enviar} noValidate>
              {errorGeneral && <div className="alerta alerta--error" role="alert">{errorGeneral}</div>}
              <fieldset className="donar__montos">
                <legend>Elige un monto</legend>
                {MONTOS.map((m) => (
                  <button
                    type="button"
                    key={m}
                    className={`donar__monto ${Number(form.monto) === m ? 'donar__monto--activo' : ''}`}
                    aria-pressed={Number(form.monto) === m}
                    onClick={() => cambiar('monto', m)}
                  >
                    {dinero(m)}
                  </button>
                ))}
              </fieldset>
              <Campo
                id="monto" label="u otro monto (COP)" type="number" min="1000" step="1000"
                value={form.monto} onChange={(e) => cambiar('monto', e.target.value)} error={errores.monto}
              />
              <Campo
                id="nombre" label="Nombre" autoComplete="name"
                value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} error={errores.nombre}
              />
              <Campo
                id="email" label="Email" type="email" autoComplete="email"
                value={form.email} onChange={(e) => cambiar('email', e.target.value)} error={errores.email}
              />
              <button className="btn btn--bloque" disabled={enviando}>
                {enviando ? 'Procesando…' : `Donar ${Number(form.monto) > 0 ? dinero(form.monto) : ''}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
