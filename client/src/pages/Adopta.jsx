import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { GridCargando, PetCard } from '../components/PetCard'
import { ErrorCarga, Vacio } from '../components/Estados'
import { ETIQUETAS } from '../utils/formato'
import './adopta.css'
import { useTitulo } from '../hooks/useTitulo'

const FILTROS = ['especie', 'genero', 'tamano', 'estado']
const NOMBRES = { especie: 'Especie', genero: 'Género', tamano: 'Tamaño', estado: 'Estado' }

// Catálogo con filtros. Los filtros viven en la URL (?especie=gato...) para poder compartir el enlace.
export function Adopta() {
  useTitulo('Mascotas en adopción')
  const [params, setParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState(params.get('q') ?? '')

  // Espera 300 ms después de escribir antes de buscar
  useEffect(() => {
    const t = setTimeout(() => {
      const actual = params.get('q') ?? ''
      if (busqueda.trim() === actual) return
      const nuevos = new URLSearchParams(params)
      busqueda.trim() ? nuevos.set('q', busqueda.trim()) : nuevos.delete('q')
      setParams(nuevos, { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda, params, setParams])

  const cambiarFiltro = (nombre, valor) => {
    const nuevos = new URLSearchParams(params)
    valor ? nuevos.set(nombre, valor) : nuevos.delete(nombre)
    setParams(nuevos, { replace: true })
  }

  const limpiar = () => {
    setBusqueda('')
    setParams({}, { replace: true })
  }

  const query = params.toString()
  const { datos, cargando, error, recargar } = useApi(`/mascotas${query ? `?${query}` : ''}`)
  const hayFiltros = query.length > 0

  return (
    <div className="contenedor">
      <div className="titulo-pagina">
        <h1>Mascotas en adopción</h1>
        <p>Todas están vacunadas, desparasitadas y listas para conocerte.</p>
      </div>

      <div className="filtros tarjeta">
        <div className="campo filtros__busqueda">
          <label htmlFor="q">Buscar</label>
          <input
            id="q"
            type="search"
            placeholder="Nombre o raza…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        {FILTROS.map((f) => (
          <div className="campo" key={f}>
            <label htmlFor={`f-${f}`}>{NOMBRES[f]}</label>
            <select id={`f-${f}`} value={params.get(f) ?? ''} onChange={(e) => cambiarFiltro(f, e.target.value)}>
              <option value="">Todos</option>
              {Object.entries(ETIQUETAS[f])
                .filter(([valor]) => f !== 'estado' || ['disponible', 'en_proceso', 'adoptada'].includes(valor))
                .map(([valor, texto]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
            </select>
          </div>
        ))}
        {hayFiltros && (
          <button className="btn btn--fantasma filtros__limpiar" onClick={limpiar}>Limpiar filtros</button>
        )}
      </div>

      {cargando && <GridCargando cantidad={8} />}
      {error && <ErrorCarga error={error} onReintentar={recargar} />}
      {datos && (
        <>
          <p className="resultados">
            {datos.length} {datos.length === 1 ? 'mascota encontrada' : 'mascotas encontradas'}
          </p>
          {datos.length === 0 ? (
            <Vacio
              titulo="No encontramos mascotas con esos filtros"
              accion={<button className="btn btn--secundario" onClick={limpiar}>Ver todas</button>}
            >
              Prueba con otra búsqueda o quita algún filtro.
            </Vacio>
          ) : (
            <div className="grid-mascotas">
              {datos.map((m) => <PetCard key={m.id} mascota={m} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
