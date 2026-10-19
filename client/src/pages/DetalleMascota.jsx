import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../context/auth'
import { useToast } from '../context/toast'
import { api } from '../services/api'
import { EstadoBadge } from '../components/EstadoBadge'
import { Campo } from '../components/Campo'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'
import { edadTexto, etiqueta, fecha, FOTO_POR_DEFECTO } from '../utils/formato'
import { useTitulo } from '../hooks/useTitulo'
import './detalle.css'

export function DetalleMascota() {
  const { id } = useParams()
  const { user } = useAuth()
  const mascota = useApi(`/mascotas/${id}`)
  const mias = useApi(user ? '/solicitudes/mias' : null)
  useTitulo(mascota.datos ? `${mascota.datos.nombre}, en adopción` : 'Mascota')

  if (mascota.cargando) return <Cargando />
  if (mascota.error?.status === 404 || mascota.error?.status === 400) {
    return (
      <Vacio titulo="Esta mascota no existe" accion={<Link to="/adopta" className="btn">Ver mascotas</Link>}>
        Puede que haya sido retirada del catálogo.
      </Vacio>
    )
  }
  if (mascota.error) return <ErrorCarga error={mascota.error} onReintentar={mascota.recargar} />

  const m = mascota.datos
  // La solicitud más reciente del usuario para esta mascota (si no fue rechazada)
  const miSolicitud = mias.datos?.find((s) => s.mascota_id === m.id && s.estado !== 'rechazada')

  const alActualizar = () => {
    mascota.recargar()
    mias.recargar()
  }

  return (
    <div className="contenedor detalle">
      <Link to="/adopta" className="detalle__volver">← Volver al catálogo</Link>

      <div className="detalle__grid">
        <div className="detalle__foto">
          <img src={m.foto_url || FOTO_POR_DEFECTO} alt={`Foto de ${m.nombre}`} onError={(e) => (e.currentTarget.src = FOTO_POR_DEFECTO)} />
        </div>

        <div>
          <div className="detalle__titulo">
            <h1>{m.nombre}</h1>
            <EstadoBadge estado={m.estado} />
          </div>
          <p className="detalle__raza">{m.raza || etiqueta('especie', m.especie)}</p>

          <dl className="detalle__datos">
            <div><dt>Especie</dt><dd>{etiqueta('especie', m.especie)}</dd></div>
            <div><dt>Edad</dt><dd>{edadTexto(m.edad_meses)}</dd></div>
            <div><dt>Género</dt><dd>{etiqueta('genero', m.genero)}</dd></div>
            <div><dt>Tamaño</dt><dd>{etiqueta('tamano', m.tamano)}</dd></div>
          </dl>

          {m.descripcion && (
            <>
              <h2 className="detalle__subtitulo">Sobre {m.nombre}</h2>
              <p>{m.descripcion}</p>
            </>
          )}

          <div className="tarjeta detalle__adopcion">
            <BloqueAdopcion mascota={m} user={user} miSolicitud={miSolicitud} cargandoMias={mias.cargando} onCambio={alActualizar} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Decide qué mostrar en la caja de adopción según el estado
function BloqueAdopcion({ mascota, user, miSolicitud, cargandoMias, onCambio }) {
  const location = useLocation()

  if (miSolicitud?.estado === 'aprobada') {
    return (
      <div className="alerta">
        🎉 <strong>¡Felicidades!</strong> Tu solicitud para adoptar a {mascota.nombre} fue aprobada. Te contactaremos pronto.
      </div>
    )
  }
  if (mascota.estado === 'adoptada') {
    return (
      <>
        <h2 className="detalle__subtitulo">{mascota.nombre} ya encontró un hogar 💚</h2>
        <p>Pero hay muchas otras mascotas esperando por ti.</p>
        <Link to="/adopta?estado=disponible" className="btn">Ver mascotas disponibles</Link>
      </>
    )
  }
  if (!user) {
    return (
      <>
        <h2 className="detalle__subtitulo">¿Quieres adoptar a {mascota.nombre}?</h2>
        <p>Inicia sesión o crea una cuenta para enviar tu solicitud.</p>
        <Link to="/login" state={{ from: location.pathname }} className="btn">Iniciar sesión para adoptar</Link>
      </>
    )
  }
  if (cargandoMias) return <Cargando />
  if (miSolicitud?.estado === 'pendiente') {
    return (
      <>
        <h2 className="detalle__subtitulo">Tu solicitud está en revisión</h2>
        <p>La enviaste el {fecha(miSolicitud.creado_en)}. Te avisaremos cuando tengamos respuesta.</p>
        <Link to="/perfil" className="btn btn--secundario">Ver mis solicitudes</Link>
      </>
    )
  }
  return <FormSolicitud mascota={mascota} user={user} onEnviada={onCambio} />
}

function FormSolicitud({ mascota, user, onEnviada }) {
  const toast = useToast()
  const [form, setForm] = useState({ telefono_contacto: user.telefono ?? '', mensaje: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (!form.telefono_contacto.trim()) return setError('Necesitamos un teléfono para contactarte')
    setError('')
    setEnviando(true)
    try {
      await api.post('/solicitudes', { mascota_id: mascota.id, ...form })
      toast.exito(`¡Solicitud enviada! Pronto sabrás de ${mascota.nombre}.`)
      onEnviada()
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <h2 className="detalle__subtitulo">Solicitar adopción</h2>
      {error && <div className="alerta alerta--error" role="alert">{error}</div>}
      <Campo
        id="telefono" label="Teléfono de contacto" type="tel" autoComplete="tel"
        value={form.telefono_contacto}
        onChange={(e) => setForm({ ...form, telefono_contacto: e.target.value })}
      />
      <Campo
        id="mensaje" label={`¿Por qué quieres adoptar a ${mascota.nombre}?`} como="textarea" opcional
        placeholder="Cuéntanos sobre tu hogar, tu rutina y si tienes otras mascotas…"
        value={form.mensaje}
        onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
      />
      <button className="btn" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar solicitud'}</button>
    </form>
  )
}
