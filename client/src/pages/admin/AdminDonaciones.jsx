import { useApi } from '../../hooks/useApi'
import { Cargando, ErrorCarga, Vacio } from '../../components/Estados'
import { dinero, fecha } from '../../utils/formato'

export function AdminDonaciones() {
  const { datos, cargando, error, recargar } = useApi('/donaciones')
  if (cargando) return <Cargando />
  if (error) return <ErrorCarga error={error} onReintentar={recargar} />

  return (
    <>
      <div className="stats" style={{ marginBottom: '1.5rem' }}>
        <div className="tarjeta stat">
          <span className="stat__valor">{dinero(datos.total)}</span>
          <span className="stat__etiqueta">Total recaudado</span>
        </div>
        <div className="tarjeta stat">
          <span className="stat__valor">{datos.cantidad}</span>
          <span className="stat__etiqueta">Donaciones</span>
        </div>
      </div>

      {datos.donaciones.length === 0 ? (
        <div className="tarjeta"><Vacio titulo="Aún no hay donaciones" /></div>
      ) : (
        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr><th>Fecha</th><th>Nombre</th><th>Email</th><th style={{ textAlign: 'right' }}>Monto</th></tr>
            </thead>
            <tbody>
              {datos.donaciones.map((d) => (
                <tr key={d.id}>
                  <td>{fecha(d.creado_en)}</td>
                  <td>{d.nombre}</td>
                  <td>{d.email}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{dinero(d.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
