import { useState } from "react"
import "./formulario.css"

export function Formulario({setUser}) {
    const [nombre, setNombre] = useState("")
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (nombre == "") {
            setError(true)
            return
        }else{
            setError(false)
        }

        setUser([nombre])
    }
    return(
        <section>
            <h1>PETFACE</h1>
            <h2>Ingresa tu nombre</h2>
            <form 
                className="formulario"
                onSubmit={handleSubmit}
            >
                <input 
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)} 
                />
                <button>Ingresar</button>
            </form>
            {error && <p>Todos los campos son obligatorios</p>}
        </section>
    )
}