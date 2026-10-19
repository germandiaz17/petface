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

  // onSubmit (en lugar de onClick) para que el navegador valide los campos "required"
  const enviar = (e) => {
    e.preventDefault()
    swal("¡Nos estaremos contactando contigo!")
    closeModal()
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
          <form id="contacto" onSubmit={enviar}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" defaultValue={user?.nombre} required />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Número de Contacto:</label>
              <input type="tel" id="telefono" name="telefono" defaultValue={user?.telefono ?? ""} required />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input type="email" id="correo" name="correo" defaultValue={user?.email} required />
            </div>
            <button type="submit">Enviar</button>
            <button type="button" onClick={closeModal}>Cerrar</button>
          </form>

        </div>
      </div>
    </div>
  );
}
