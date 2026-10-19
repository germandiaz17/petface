import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useToast } from '../../context/toast'
import { api } from '../../services/api'
import { Confirmar } from '../../components/Confirmar'
import { Cargando, ErrorCarga, Vacio } from '../../components/Estados'
import { fecha } from '../../utils/formato'

export function AdminTestimonios() {
  const toast = useToast()
  const { datos, cargando, error, recargar } = useApi('/testimonios/todos')
  const [aBorrar, setABorrar] = useState(null)

  const alternar = async (t) => {
    try {
      await api.patch(`/testimonios/${t.id}`, { aprobado: !t.aprobado })
      toast.exito(t.aprobado ? 'Testimonio ocultado' : 'Testimonio publicado')
      recargar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const borrar = async () => {
    try {
      await api.delete(`/testimonios/${aBorrar.id}`)
      toast.exito('Testimonio eliminado')
      recargar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const pendientes = datos?.filter((t) => !t.aprobado).length ?? 0

  return (
    <>
      <div className="admin__barra">
        <h2>Testimonios {pendientes > 0 && <span className="badge badge--pendiente">{pendientes} por revisar</span>}</h2>
      </div>

      {cargando && <Cargando />}
      {error && <ErrorCarga error={error} onReintentar={recargar} />}
      {datos?.length === 0 && <div className="tarjeta"><Vacio titulo="Aún no hay testimonios" /></div>}
      {datos?.length > 0 && (
        <ul className="items">
          {datos.map((t) => (
            <li key={t.id} className="tarjeta item item--sin-foto">
              <div>
                <div className="item__titulo">
                  <strong>{t.autor}</strong>
                  <span className={`badge ${t.aprobado ? 'badge--aprobado' : 'badge--pendiente'}`}>
                    {t.aprobado ? 'Publicado' : 'Por revisar'}
                  </span>
                </div>
                <div className="item__meta">{fecha(t.creado_en)}</div>
                <p className="item__mensaje">{t.texto}</p>
              </div>
              <div className="item__acciones">
                <button className={`btn btn--sm ${t.aprobado ? 'btn--secundario' : ''}`} onClick={() => alternar(t)}>
                  {t.aprobado ? 'Ocultar' : 'Publicar'}
                </button>
                <button className="btn btn--fantasma btn--sm" onClick={() => setABorrar(t)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Confirmar
        abierto={!!aBorrar}
        onCerrar={() => setABorrar(null)}
        onConfirmar={borrar}
        titulo="¿Eliminar este testimonio?"
        textoConfirmar="Eliminar"
        peligro
      >
        Se eliminará el testimonio de <strong>{aBorrar?.autor}</strong>.
      </Confirmar>
    </>
  )
}
