import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Cargando, ErrorCarga } from '../../components/Estados'
import { dinero } from '../../utils/formato'
import { SistemaDistribuido } from './SistemaDistribuido'

export function AdminResumen() {
  const { datos, cargando, error, recargar } = useApi('/admin/resumen')
  if (cargando) return <Cargando />
  if (error) return <ErrorCarga error={error} onReintentar={recargar} />

  const { mascotas, solicitudes, donaciones } = datos
  const pendientes = solicitudes.pendiente ?? 0
  const STATS = [
    { valor: pendientes, etiqueta: 'Solicitudes pendientes', to: '/admin/solicitudes', destacada: pendientes > 0 },
    { valor: mascotas.disponible ?? 0, etiqueta: 'Mascotas disponibles', to: '/admin/mascotas' },
    { valor: mascotas.en_proceso ?? 0, etiqueta: 'En proceso de adopción', to: '/admin/mascotas' },
    { valor: mascotas.adoptada ?? 0, etiqueta: 'Mascotas adoptadas', to: '/admin/mascotas' },
    { valor: dinero(donaciones.total), etiqueta: `Donado (${donaciones.cantidad} donaciones)`, to: '/admin/donaciones' },
  ]

  return (
    <>
    <div className="stats">
      {STATS.map((s) => (
        <Link key={s.etiqueta} to={s.to} className={`tarjeta stat ${s.destacada ? 'stat--destacada' : ''}`}>
          <span className="stat__valor">{s.valor}</span>
          <span className="stat__etiqueta">{s.etiqueta}</span>
        </Link>
      ))}
    </div>
    <SistemaDistribuido />
    </>
  )
}
