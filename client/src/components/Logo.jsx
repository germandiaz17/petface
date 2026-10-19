// Marca de PetFace: huella + nombre
export function Logo({ claro = false }) {
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`}>
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="currentColor">
        <ellipse cx="6" cy="9" rx="2.2" ry="2.8" />
        <ellipse cx="10" cy="5.5" rx="2.2" ry="2.8" />
        <ellipse cx="14" cy="5.5" rx="2.2" ry="2.8" />
        <ellipse cx="18" cy="9" rx="2.2" ry="2.8" />
        <path d="M12 11c-3 0-6.5 4.2-6.5 7 0 1.8 1.4 2.8 3 2.8 1.4 0 2.2-.8 3.5-.8s2.1.8 3.5.8c1.6 0 3-1 3-2.8 0-2.8-3.5-7-6.5-7z" />
      </svg>
      PetFace
    </span>
  )
}
