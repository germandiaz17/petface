import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { GridCargando, PetCard } from '../components/PetCard'
import { ErrorCarga } from '../components/Estados'
import heroImg from '../assets/img/hero.jpg'
import './inicio.css'
import { useTitulo } from '../hooks/useTitulo'

const PASOS = [
  { n: 1, titulo: 'Explora', texto: 'Conoce a las mascotas que buscan hogar y filtra por especie, tamaño o edad.' },
  { n: 2, titulo: 'Solicita', texto: 'Crea tu cuenta y cuéntanos por qué quieres adoptar. Solo toma un minuto.' },
  { n: 3, titulo: 'Recibe a tu compañero', texto: 'Revisamos tu solicitud, te contactamos y coordinamos la entrega.' },
]

export function Inicio() {
  useTitulo()
  const mascotas = useApi('/mascotas?estado=disponible')
  const testimonios = useApi('/testimonios')

  return (
    <>
      <section className="hero" style={{ '--hero-img': `url(${heroImg})` }}>
        <div className="contenedor hero__contenido">
          <h1>¡Adoptar es amar en grande!</h1>
          <p>Encuentra a tu compañero perfecto y cambia una vida hoy mismo.</p>
          <div className="hero__acciones">
            <Link to="/adopta" className="btn">Ver mascotas</Link>
            <Link to="/donar" className="btn btn--secundario">Hacer una donación</Link>
          </div>
        </div>
      </section>

      <section className="seccion contenedor">
        <div className="seccion__cabecera">
          <div>
            <h2>¿Cómo funciona?</h2>
            <p>Adoptar con PetFace es simple y seguro.</p>
          </div>
        </div>
        <ol className="pasos">
          {PASOS.map((p) => (
            <li key={p.n} className="tarjeta paso">
              <span className="paso__numero">{p.n}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="seccion seccion--suave">
        <div className="contenedor">
          <div className="seccion__cabecera">
            <div>
              <h2>Buscan un hogar</h2>
              <p>Algunas de las mascotas disponibles ahora mismo.</p>
            </div>
            <Link to="/adopta" className="btn btn--secundario">Ver todas →</Link>
          </div>
          {mascotas.cargando && <GridCargando />}
          {mascotas.error && <ErrorCarga error={mascotas.error} onReintentar={mascotas.recargar} />}
          {mascotas.datos && (
            <div className="grid-mascotas">
              {mascotas.datos.slice(0, 4).map((m) => <PetCard key={m.id} mascota={m} />)}
            </div>
          )}
        </div>
      </section>

      {testimonios.datos?.length > 0 && (
        <section className="seccion contenedor">
          <div className="seccion__cabecera">
            <div>
              <h2>Historias felices</h2>
              <p>Lo que cuentan las familias que ya adoptaron.</p>
            </div>
          </div>
          <div className="testimonios">
            {testimonios.datos.slice(0, 6).map((t) => (
              <figure key={t.id} className="tarjeta testimonio">
                <blockquote>“{t.texto}”</blockquote>
                <figcaption>— {t.autor}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="contenedor">
        <div className="cta">
          <div>
            <h2>¿No puedes adoptar? También puedes ayudar</h2>
            <p>Tu donación cubre alimento, vacunas y cuidados mientras encuentran familia.</p>
          </div>
          <Link to="/donar" className="btn btn--secundario">Quiero donar</Link>
        </div>
      </section>
    </>
  )
}
