import "./carta.css";
import swal from "sweetalert"
export function Carta({
  isOpen,
  closeModal,
  foto,
  nombre,
  raza,
  genero,
  desc,
  user
}) {
  if (!isOpen) return null;

  const mostrarAlerta = (e) => {
    e.preventDefault()
    swal("¡Nos estaremos contactando contigo!")
  }

  return (
    <div className="modal">
      <div className="content-modal">
        <div className="image">
          <img src={foto} alt={nombre} />
        </div>
        <div className="info">
          <h2>NOMBRE: {nombre}</h2>
          <h2>RAZA: {raza}</h2>
          <h2>GENERO: {genero}</h2>
          <p>DESCRIPCION: {desc}</p>
          <h2>Deja tu Información de Contacto</h2>
          <form id="contacto">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value={user} required />
            </div>
            <div class="form-group">
              <label for="telefono">Número de Contacto:</label>
              <input type="tel" id="telefono" name="telefono" required />
            </div>
            <div class="form-group">
              <label for="correo">Correo Electrónico:</label>
              <input type="email" id="correo" name="correo" required />
            </div>
            <button type="submit" onClick={mostrarAlerta}>Enviar</button>
            <button onClick={() => closeModal(false)}>cerrar</button>
          </form>

        </div>
      </div>
    </div>
  );
}
