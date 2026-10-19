import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useToast } from '../../context/toast'
import { api } from '../../services/api'
import { EstadoBadge } from '../../components/EstadoBadge'
import { Confirmar } from '../../components/Confirmar'
import { Cargando, ErrorCarga, Vacio } from '../../components/Estados'
import { edadTexto, etiqueta, FOTO_POR_DEFECTO } from '../../utils/formato'

// Listado de mascotas con acciones de editar y eliminar (la R, U y D del CRUD)
export function AdminMascotas() {
  const toast = useToast()
  const { datos, cargando, error, recargar } = useApi('/mascotas')
  const [filtro, setFiltro] = useState('')
  const [aBorrar, setABorrar] = useState(null)

  const borrar = async () => {
    try {
      await api.delete(`/mascotas/${aBorrar.id}`)
      toast.exito(`${aBorrar.nombre} fue eliminada`)
      recargar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const lista = (datos ?? []).filter((m) =>
    `${m.nombre} ${m.raza ?? ''}`.toLowerCase().includes(filtro.trim().toLowerCase()),
  )

  return (
    <>
      <div className="admin__barra">
        <h2>Mascotas {datos && <small>({datos.length})</small>}</h2>
        <div className="admin__subfiltros">
          <div className="campo">
            <label htmlFor="buscar" className="sr-only">Buscar</label>
            <input id="buscar" type="search" placeholder="Buscar por nombre o raza…" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          </div>
          <Link to="/admin/mascotas/nueva" className="btn">+ Nueva mascota</Link>
        </div>
      </div>

      {cargando && <Cargando />}
      {error && <ErrorCarga error={error} onReintentar={recargar} />}
      {datos && lista.length === 0 && (
        <div className="tarjeta"><Vacio titulo="No hay mascotas que coincidan" /></div>
      )}
      {lista.length > 0 && (
        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Especie</th>
                <th>Edad</th>
                <th>Estado</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img className="miniatura" src={m.foto_url || FOTO_POR_DEFECTO} alt="" />
                      <div>
                        <strong>{m.nombre}</strong>
                        <div className="item__meta">{m.raza || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{etiqueta('especie', m.especie)} · {etiqueta('genero', m.genero)}</td>
                  <td>{edadTexto(m.edad_meses)}</td>
                  <td><EstadoBadge estado={m.estado} /></td>
                  <td>
                    <div className="tabla__acciones">
                      <Link to={`/mascotas/${m.id}`} className="btn btn--fantasma btn--sm">Ver</Link>
                      <Link to={`/admin/mascotas/${m.id}`} className="btn btn--secundario btn--sm">Editar</Link>
                      <button className="btn btn--peligro btn--sm" onClick={() => setABorrar(m)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Confirmar
        abierto={!!aBorrar}
        onCerrar={() => setABorrar(null)}
        onConfirmar={borrar}
        titulo={`¿Eliminar a ${aBorrar?.nombre}?`}
        textoConfirmar="Eliminar"
        peligro
      >
        Se borrará la mascota y todas sus solicitudes de adopción. Esta acción no se puede deshacer.
      </Confirmar>
    </>
  )
}
