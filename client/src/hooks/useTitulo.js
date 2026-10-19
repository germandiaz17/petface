import { useEffect } from 'react'

// Cambia el título de la pestaña del navegador: useTitulo('Adopta') → "Adopta · PetFace"
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · PetFace` : 'PetFace · Adopta una mascota'
  }, [titulo])
}
