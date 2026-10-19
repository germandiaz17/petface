import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { useToast } from '../context/toast'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import { EstadoBadge } from '../components/EstadoBadge'
import { Confirmar } from '../components/Confirmar'
import { Campo } from '../components/Campo'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'
import { fecha, FOTO_POR_DEFECTO } from '../utils/formato'
import './perfil.css'

export function Perfil() {
  const { user } = useAuth()
  const toast = useToast()
  const solicitudes = useApi('/solicitudes/mias')
  const [aCancelar, setACancelar] = useState(null)

  const cancelar = async () => {
    try {
      await api.delete(`/solicitudes/${aCancelar.id}`)
      toast.exito('Solicitud cancelada')
      solicitudes.recargar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="contenedor">
      <div className="titulo-pagina">
        <h1>Mi perfil</h1>
        <p>Tus datos y el estado de tus solicitudes de adopción.</p>
      </div>

      <div className="perfil">
        <aside className="tarjeta perfil__datos">
          <div className="perfil__avatar" aria-hidden="true">{user.nombre[0]?.toUpperCase()}</div>
          <h2>{user.nombre}</h2>
          <dl>
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Teléfono</dt><dd>{user.telefono || 'Sin registrar'}</dd>
            <dt>Tipo de cuenta</dt><dd>{user.rol === 'admin' ? 'Administrador' : 'Adoptante'}</dd>
            {user.creado_en && (<><dt>Miembro desde</dt><dd>{fecha(user.creado_en)}</dd></>)}
          </dl>
        </aside>

        <div className="perfil__principal">
          <section>
            <h2>Mis solicitudes</h2>
            {solicitudes.cargando && <Cargando />}
            {solicitudes.error && <ErrorCarga error={solicitudes.error} onReintentar={solicitudes.recargar} />}
            {solicitudes.datos?.length === 0 && (
              <div className="tarjeta">
                <Vacio titulo="Aún no has enviado solicitudes" accion={<Link to="/adopta" className="btn">Conocer mascotas</Link>}>
                  Cuando solicites adoptar a una mascota, aquí verás en qué estado va.
                </Vacio>
              </div>
            )}
            {solicitudes.datos?.length > 0 && (
              <ul className="solicitudes">
                {solicitudes.datos.map((s) => (
                  <li key={s.id} className="tarjeta solicitud">
                    <img className="solicitud__foto" src={s.mascota_foto || FOTO_POR_DEFECTO} alt="" />
                    <div className="solicitud__info">
                      <Link to={`/mascotas/${s.mascota_id}`} className="solicitud__nombre">{s.mascota_nombre}</Link>
                      <span className="solicitud__fecha">Enviada el {fecha(s.creado_en)}</span>
                    </div>
                    <EstadoBadge estado={s.estado} />
                    {s.estado === 'pendiente' && (
                      <button className="btn btn--fantasma btn--sm" onClick={() => setACancelar(s)}>Cancelar</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <FormTestimonio />
        </div>
      </div>

      <Confirmar
        abierto={!!aCancelar}
        onCerrar={() => setACancelar(null)}
        onConfirmar={cancelar}
        titulo="¿Cancelar la solicitud?"
        textoConfirmar="Sí, cancelar"
        peligro
      >
        Vas a retirar tu solicitud para adoptar a <strong>{aCancelar?.mascota_nombre}</strong>.
      </Confirmar>
    </div>
  )
}

function FormTestimonio() {
  const toast = useToast()
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (texto.trim().length < 10) return setError('Cuéntanos un poco más (mínimo 10 caracteres)')
    setError('')
    setEnviando(true)
    try {
      await api.post('/testimonios', { texto: texto.trim() })
      setTexto('')
      toast.exito('¡Gracias! Publicaremos tu historia cuando sea revisada.')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="tarjeta">
      <h2>Comparte tu historia</h2>
      <p className="perfil__ayuda">¿Ya adoptaste? Tu experiencia puede animar a otras familias.</p>
      <form className="formulario" onSubmit={enviar} noValidate>
        <Campo
          id="testimonio" label="Tu testimonio" como="textarea" maxLength={1000}
          value={texto} onChange={(e) => setTexto(e.target.value)} error={error}
        />
        <div>
          <button className="btn" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar testimonio'}</button>
        </div>
      </form>
    </section>
  )
}
