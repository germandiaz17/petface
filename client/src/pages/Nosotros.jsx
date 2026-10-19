import { Link } from 'react-router-dom'
import './nosotros.css'
import { useTitulo } from '../hooks/useTitulo'

const VALORES = [
  { icono: '🐾', titulo: 'Bienestar primero', texto: 'Cada mascota recibe atención veterinaria, vacunas y cariño antes de ser adoptada.' },
  { icono: '🤝', titulo: 'Adopción responsable', texto: 'Revisamos cada solicitud para encontrar el hogar adecuado para cada animal.' },
  { icono: '💚', titulo: 'Comunidad', texto: 'Voluntarios, donantes y familias adoptantes hacen posible nuestro trabajo.' },
]

export function Nosotros() {
  useTitulo('Sobre nosotros')
  return (
    <div className="contenedor">
      <div className="titulo-pagina">
        <h1>Sobre PetFace</h1>
        <p>Conectamos animales que necesitan un hogar con personas dispuestas a darles amor.</p>
      </div>

      <section className="nosotros__mision tarjeta">
        <h2>Nuestra misión</h2>
        <p>
          PetFace nació como un foro de adopciones para dar visibilidad a perros y gatos rescatados. Creemos que
          adoptar es un acto de amor que cambia dos vidas: la de la mascota y la de su nueva familia.
        </p>
      </section>

      <section className="seccion">
        <div className="nosotros__valores">
          {VALORES.map((v) => (
            <div key={v.titulo} className="tarjeta">
              <div className="nosotros__icono" aria-hidden="true">{v.icono}</div>
              <h3>{v.titulo}</h3>
              <p>{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="nosotros__contacto tarjeta">
        <div>
          <h2>Contacto</h2>
          <p>¿Tienes preguntas sobre una adopción o quieres ser voluntario? Escríbenos.</p>
        </div>
        <ul>
          <li><strong>Email:</strong> contacto@petface.com</li>
          <li><strong>Teléfono:</strong> +57 300 000 0000</li>
          <li><strong>Dirección:</strong> Carrera 10 No 26 – 51</li>
        </ul>
        <Link to="/adopta" className="btn">Conoce a las mascotas</Link>
      </section>
    </div>
  )
}
