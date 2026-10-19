import "./tarjeta.css";
import { Carta } from "./Carta";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export function Tarjeta({ nombre, raza, desc, foto, genero }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Para adoptar hay que iniciar sesión; después se vuelve a esta página
  const adoptar = () => {
    if (!user) return navigate("/login", { state: { from: location.pathname } });
    setIsOpenModal(true);
  };

  return (
    <div className="card">
      <img src={foto} alt={nombre} width="250" height="250" />
      <div className="card-content">
        <h3>{nombre}</h3>
        <p>{desc}</p>
        <button onClick={adoptar}>Adoptar</button>
        <Carta
          isOpen={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          foto={foto}
          nombre={nombre}
          raza={raza}
          genero={genero}
          desc={desc}
          user={user}
        />
      </div>
    </div>
  );
}
