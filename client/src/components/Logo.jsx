import { Huella } from './Huella'

// Marca de PetFace: huella + nombre
export function Logo({ claro = false }) {
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`}>
      <Huella />
      PetFace
    </span>
  )
}
