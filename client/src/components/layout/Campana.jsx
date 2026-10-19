import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { notif } from '../../services/api'
import './campana.css'

const CADA_MS = 20000 // consulta el microservicio cada 20 s

function haceCuanto(iso) {
  const min = Math.round((Date.now() - new Date(iso)) / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.round(min / 60)
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`
}

// Campana de avisos. Los datos vienen del MICROSERVICIO de notificaciones (/notif),
// no de la API principal. Si el microservicio no responde, la campana simplemente se oculta.
export function Campana() {
  const [datos, setDatos] = useState(null)
  const [abierta, setAbierta] = useState(false)
  const caja = useRef(null)

  const cargar = useCallback(() => {
    notif.get('/notificaciones').then(setDatos).catch(() => setDatos(null))
  }, [])

  useEffect(() => {
    cargar()
    const t = setInterval(cargar, CADA_MS)
    return () => clearInterval(t)
  }, [cargar])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!abierta) return
    const fuera = (e) => !caja.current?.contains(e.target) && setAbierta(false)
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [abierta])

  const alternar = () => {
    const abrir = !abierta
    setAbierta(abrir)
    if (abrir && datos?.no_leidas > 0) {
      // marca como leídas en el servidor; el contador se limpia al cerrar
      notif.patch('/notificaciones/leidas').catch(() => {})
    }
    if (!abrir) cargar()
  }

  if (!datos) return null

  return (
    <div className="campana" ref={caja}>
      <button
        className="campana__boton"
        onClick={alternar}
        aria-expanded={abierta}
        aria-label={`Notificaciones${datos.no_leidas ? `, ${datos.no_leidas} sin leer` : ''}`}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {datos.no_leidas > 0 && <span className="campana__contador">{datos.no_leidas > 9 ? '9+' : datos.no_leidas}</span>}
      </button>

      {abierta && (
        <div className="campana__panel" role="dialog" aria-label="Notificaciones">
          <div className="campana__cabecera">Notificaciones</div>
          {datos.notificaciones.length === 0 ? (
            <p className="campana__vacio">No tienes avisos todavía.</p>
          ) : (
            <ul>
              {datos.notificaciones.map((n) => (
                <li key={n.id} className={n.leida ? '' : 'campana__nueva'}>
                  <Link to={n.enlace ?? '#'} onClick={() => setAbierta(false)}>
                    <strong>{n.titulo}</strong>
                    <span>{n.mensaje}</span>
                    <small>{haceCuanto(n.creado_en)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="campana__pie">Servido por el microservicio de notificaciones</div>
        </div>
      )}
    </div>
  )
}
