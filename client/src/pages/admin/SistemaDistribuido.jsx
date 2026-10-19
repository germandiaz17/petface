import { useState } from 'react'

const PETICIONES = 8

// Consulta un servicio y devuelve { ok, instancia, ms }
async function sondear(ruta) {
  const inicio = performance.now()
  try {
    const res = await fetch(ruta, { cache: 'no-store' })
    const datos = await res.json().catch(() => ({}))
    return { ok: res.ok, instancia: res.headers.get('X-Instancia') ?? datos.instancia ?? '¿?', ms: Math.round(performance.now() - inicio) }
  } catch {
    return { ok: false, instancia: 'sin respuesta', ms: Math.round(performance.now() - inicio) }
  }
}

// Tarjeta para la demo: muestra qué réplica de la API responde cada petición
// (balanceo de carga del gateway) y el estado del microservicio de notificaciones.
export function SistemaDistribuido() {
  const [resultado, setResultado] = useState(null)
  const [probando, setProbando] = useState(false)

  const probar = async () => {
    setProbando(true)
    const api = []
    for (let i = 0; i < PETICIONES; i++) api.push(await sondear('/api/health'))
    const notif = await sondear('/notif/health')
    setResultado({ api, notif })
    setProbando(false)
  }

  const instancias = resultado ? [...new Set(resultado.api.filter((r) => r.ok).map((r) => r.instancia))] : []

  return (
    <section className="tarjeta sistema">
      <div className="sistema__cabecera">
        <div>
          <h2>Sistema distribuido</h2>
          <p>Envía {PETICIONES} peticiones seguidas a la API y consulta el microservicio de notificaciones.</p>
        </div>
        <button className="btn btn--secundario" onClick={probar} disabled={probando}>
          {probando ? 'Probando…' : resultado ? 'Probar de nuevo' : 'Probar balanceo'}
        </button>
      </div>

      {resultado && (
        <div className="sistema__resultado">
          <div>
            <h3>API principal · {instancias.length} {instancias.length === 1 ? 'instancia' : 'instancias'} respondieron</h3>
            <ol className="sistema__peticiones">
              {resultado.api.map((r, i) => (
                <li key={i} className={r.ok ? `sistema__chip sistema__chip--${instancias.indexOf(r.instancia) % 4}` : 'sistema__chip sistema__chip--error'}>
                  <span>#{i + 1}</span> {r.instancia} <small>{r.ms} ms</small>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Microservicio de notificaciones</h3>
            <p className={`sistema__estado ${resultado.notif.ok ? 'sistema__estado--ok' : 'sistema__estado--error'}`}>
              {resultado.notif.ok ? `● En línea (${resultado.notif.instancia}, ${resultado.notif.ms} ms)` : '● Sin respuesta: la app sigue funcionando sin avisos'}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
