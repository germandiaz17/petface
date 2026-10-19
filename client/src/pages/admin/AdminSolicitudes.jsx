import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useToast } from '../../context/toast'
import { api } from '../../services/api'
import { EstadoBadge } from '../../components/EstadoBadge'
import { Confirmar } from '../../components/Confirmar'
import { Cargando, ErrorCarga, Vacio } from '../../components/Estados'
import { fecha, FOTO_POR_DEFECTO } from '../../utils/formato'

const FILTROS = [
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'aprobada', texto: 'Aprobadas' },
  { valor: 'rechazada', texto: 'Rechazadas' },
  { valor: '', texto: 'Todas' },
]

export function AdminSolicitudes() {
  const toast = useToast()
  const [estado, setEstado] = useState('pendiente')
  const { datos, cargando, error, recargar } = useApi(`/solicitudes${estado ? `?estado=${estado}` : ''}`)
  const [accion, setAccion] = useState(null) // { solicitud, estado: 'aprobada' | 'rechazada' }

  const confirmar = async () => {
    try {
      await api.patch(`/solicitudes/${accion.solicitud.id}`, { estado: accion.estado })
      toast.exito(accion.estado === 'aprobada' ? '¡Adopción aprobada!' : 'Solicitud rechazada')
      recargar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const aprobando = accion?.estado === 'aprobada'

  return (
    <>
      <div className="admin__barra">
        <h2>Solicitudes de adopción</h2>
        <div className="admin__subfiltros">
          {FILTROS.map((f) => (
            <button
              key={f.texto}
              className={`btn btn--sm ${estado === f.valor ? '' : 'btn--secundario'}`}
              aria-pressed={estado === f.valor}
              onClick={() => setEstado(f.valor)}
            >
              {f.texto}
            </button>
          ))}
        </div>
      </div>

      {cargando && <Cargando />}
      {error && <ErrorCarga error={error} onReintentar={recargar} />}
      {datos?.length === 0 && (
        <div className="tarjeta"><Vacio titulo="No hay solicitudes en esta categoría" /></div>
      )}
      {datos?.length > 0 && (
        <ul className="items">
          {datos.map((s) => (
            <li key={s.id} className="tarjeta item">
              <img className="miniatura" src={s.mascota_foto || FOTO_POR_DEFECTO} alt="" style={{ width: 64, height: 64 }} />
              <div>
                <div className="item__titulo">
                  <strong>
                    {s.usuario_nombre} quiere adoptar a <Link to={`/mascotas/${s.mascota_id}`}>{s.mascota_nombre}</Link>
                  </strong>
                  <EstadoBadge estado={s.estado} />
                </div>
                <div className="item__meta">
                  {s.usuario_email} · Tel. {s.telefono_contacto || '—'} · {fecha(s.creado_en)}
                </div>
                {s.mensaje && <p className="item__mensaje">{s.mensaje}</p>}
              </div>
              {s.estado === 'pendiente' && (
                <div className="item__acciones">
                  <button className="btn btn--sm" onClick={() => setAccion({ solicitud: s, estado: 'aprobada' })}>Aprobar</button>
                  <button className="btn btn--secundario btn--sm" onClick={() => setAccion({ solicitud: s, estado: 'rechazada' })}>Rechazar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Confirmar
        abierto={!!accion}
        onCerrar={() => setAccion(null)}
        onConfirmar={confirmar}
        titulo={aprobando ? '¿Aprobar la adopción?' : '¿Rechazar la solicitud?'}
        textoConfirmar={aprobando ? 'Aprobar' : 'Rechazar'}
        peligro={!aprobando}
      >
        {aprobando ? (
          <p>
            <strong>{accion?.solicitud.mascota_nombre}</strong> quedará como adoptada por{' '}
            <strong>{accion?.solicitud.usuario_nombre}</strong> y las demás solicitudes pendientes para esta mascota se rechazarán.
          </p>
        ) : (
          <p>Se rechazará la solicitud de <strong>{accion?.solicitud.usuario_nombre}</strong>.</p>
        )}
      </Confirmar>
    </>
  )
}
