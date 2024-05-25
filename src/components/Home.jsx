import "./home.css";
import { Tarjeta } from "./Tarjeta";
import imagenes from "../assets/imagenes";

export function Home({ user, setUser }) {
  const handleLogout = () => {
    setUser([]);
  };
  return (
    <div>
        <div className="presentacion">
          <div className="pres-iz">
            <h1>¡Adoptar es amar en grande!</h1>
          </div>
        </div>

        {/* INICIO */}
        <header>
          <h1>{user}, Bienvenido a PetFace </h1>
        </header>

        <section className="hero">
          <h2>Encuentra tu Compañero Perfecto</h2>
          <p>Adopta una mascota y cambia una vida hoy mismo.</p>
          <button>Explora Adopciones</button>
          <button onClick={handleLogout}>Cerrar Sesion</button>
        </section>

        <section className="section">
          <h2>Animales Disponibles</h2>
          <p>
            Estos son nuestros animales que están buscando un hogar
            amoroso. ¡Adóptalos hoy y dales una nueva oportunidad de vida!
          </p>
          <div className="listado">
            <Tarjeta
              nombre={"paris"}
              raza={"Calico"}
              desc={
                "Paris es una gata Calico de 3 años. Su pelaje es una hermosa mezcla de negro, blanco y anaranjado, típico de su raza. Paris es una gata muy cariñosa y le encanta acurrucarse en el regazo de las personas. Es juguetona y curiosa, siempre explorando su entorno. Se lleva bien con otros gatos y es muy amigable con las personas. Paris está esterilizada, vacunada y en perfecto estado de salud. Está buscando un hogar amoroso donde pueda recibir y dar mucho amor."
              }
              foto={imagenes.img1}
              genero={"Hembra"}
              user={user}
            />
            <Tarjeta
              nombre={"Max"}
              raza={"Huskye"}
              desc={
                "Max es un Labrador Retriever de 3 años, conocido por su pelaje dorado y su energía inagotable. Es un perro muy sociable y amigable, que disfruta de la compañía tanto de personas como de otros animales. Max adora jugar al aire libre, especialmente con pelotas y frisbees, y siempre está listo para una aventura. Es muy inteligente y ha sido entrenado en obediencia básica, lo que lo hace muy fácil de manejar. Max es ideal para una familia activa que pueda proporcionarle el ejercicio y la atención que necesita. Está vacunado, desparasitado y en perfecto estado de salud, listo para encontrar un hogar amoroso."
              }
              foto={imagenes.img2}
              genero={"Macho"}
              user={user}
            />
            <Tarjeta
              nombre={"Bella"}
              raza={"Golden Retriever"}
              desc={
                "Bella es una Golden Retriever de 2 años, con un pelaje dorado brillante y un carácter excepcionalmente cariñoso. Le encanta estar rodeada de personas y es especialmente buena con los niños, lo que la convierte en la mascota perfecta para familias. Bella disfruta de los paseos largos y es muy obediente, siempre lista para aprender nuevos trucos. Además, tiene un temperamento tranquilo y se lleva bien con otros animales. Bella está vacunada, esterilizada y ha recibido todas sus revisiones veterinarias, asegurando que está en óptimas condiciones de salud. Busca un hogar donde pueda recibir el amor y el cuidado que tanto merece."
              }
              foto={imagenes.img3}
              genero={"Hembra"}
              user={user}
            />
            <Tarjeta
              nombre={"Luna"}
              raza={"Hembra"}
              desc={
                "Luna es una gata Siamés de 4 años, reconocida por su elegante pelaje color crema con puntos oscuros y sus impactantes ojos azules. Luna es una gata muy independiente, pero también muy afectuosa cuando se siente cómoda. Le gusta pasar tiempo en lugares altos observando todo a su alrededor, y es muy curiosa por naturaleza. Luna es perfecta para un hogar tranquilo, idealmente sin otros animales, donde pueda ser la reina del hogar. Le encanta jugar con juguetes interactivos y disfruta de las caricias. Luna está esterilizada, vacunada y en excelente estado de salud. Está buscando un hogar donde pueda sentirse segura y amada."
              }
              foto={imagenes.img4}
              genero={"Hembra"}
              user={user}
            />
          </div>
        </section>

        <section className="testimonios">
          <h2>Testimonios</h2>
          <blockquote>
            Gracias a PetFace, encontré a mi mejor amigo, Rocky. No puedo
            imaginar mi vida sin él.
            <cite>- Juan D.</cite>
          </blockquote>
          <blockquote>
            Adopción fue fácil y el equipo de PetFace nos ayudó en cada paso del
            camino. Ahora tenemos a Coco, y no podríamos estar más felices.
            <cite>- Ana R.</cite>
          </blockquote>
          <blockquote>
            Adoptamos a Simba hace seis meses, y ha sido una bendición. PetFace
            realmente se preocupa por sus animales y por encontrarles el hogar
            adecuado.
            <cite>- Carlos M.</cite>
          </blockquote>
          <blockquote>
            PetFace hizo que el proceso de adopción fuera sencillo y agradable.
            Estamos encantados con nuestro nuevo miembro de la familia, Luna.
            <cite>- Laura G.</cite>
          </blockquote>
          <blockquote>
            La dedicación y el amor que PetFace pone en cuidar a los animales es
            increíble. Adoptar a Toby fue la mejor decisión que pudimos tomar.
            <cite>- Sergio T.</cite>
          </blockquote>
          <blockquote>
            Gracias a PetFace, pudimos darle a Max un hogar lleno de amor. La
            adopción fue una experiencia maravillosa.
            <cite>- Paula S.</cite>
          </blockquote>
          <blockquote>
            Estamos muy agradecidos con PetFace por ayudarnos a encontrar a
            nuestro adorable gato, Oliver. Él ha llenado nuestra casa de
            alegría.
            <cite>- Diana F.</cite>
          </blockquote>
          {/* <!-- Agrega más testimonios según sea necesario --> */}
        </section>

        {/* DONACIONES */}
        <div className="donaciones" id="donaciones">
          <h2>Haz una Donación</h2>
          <p>
            Tu apoyo nos ayuda a encontrar hogares amorosos para animales en
            necesidad. Cada donación, sin importar su tamaño, marca una gran
            diferencia en la vida de estos animales.
          </p>

          <div className="donaciones-formulario">
            <form className="/ruta/de/tu/formulario" method="post">
              <input
                type="text"
                name="nombre"
                placeholder="Tu Nombre"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Tu Email"
                required
              />
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad (USD)"
                required
              />
              <button type="submit">Donar Ahora</button>
            </form>
          </div>

          <div className="donaciones-metodos">
            <div className="donaciones-metodo">
              <a href="https://www.paypal.com/donate" target="_blank">
                {/* <img src="ruta/a/logo-paypal.png" alt="Donar con PayPal"> */}
                <p>Donar con PayPal</p>
              </a>
            </div>
            <div className="donaciones-metodo">
              <a href="https://www.visa.com" target="_blank">
                {/* <img src="ruta/a/logo-visa.png" alt="Donar con Visa"> */}
                <p>Donar con Visa</p>
              </a>
            </div>
            <div className="donaciones-metodo">
              <a href="https://www.mastercard.com" target="_blank">
                {/* <img src="ruta/a/logo-mastercard.png" alt="Donar con MasterCard"> */}
                <p>Donar con MasterCard</p>
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-section">
              <h3>Sobre PetFace</h3>
              <p>
                PetFace es una organización dedicada a encontrar hogares
                amorosos para animales domésticos en necesidad.
              </p>
            </div>
            <div className="footer-section">
              <h3>Enlaces Útiles</h3>
              <ul>
                <li>
                  <a href="#">Inicio</a>
                </li>
                <li>
                  <a href="#">Adopta</a>
                </li>
                <li>
                  <a href="#">Donaciones</a>
                </li>
                <li>
                  <a href="#">Contacto</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contacto</h3>
              <ul>
                <li>Email: contacto@petface.com</li>
                <li>Teléfono: +1 234 567 890</li>
                <li>Dirección: Carrera 10 No 26 – 51</li>
              </ul>
            </div>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank">
              Instagram
            </a>
          </div>
          <div className="footer-bottom">
            &copy; 2024 PetFace. Todos los derechos reservados.
          </div>
        </footer>
    </div>
  );
}
