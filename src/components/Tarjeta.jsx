// import { useState } from "react";
import "./tarjeta.css";
import {Carta} from "./Carta"
import { useState } from "react";
export function Tarjeta({ nombre, raza, desc, foto, genero, user }) {
  const [isOpenModal, setIsOpenModal] = useState(false)


  return (
      <div className="card">
        <img src={foto} alt={nombre} width="250" height="250" />
        <div className="card-content">
          <h3>{nombre}</h3>
          <p>{desc}</p>
          <button onClick={() => setIsOpenModal(true) }>Adoptar</button>
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
