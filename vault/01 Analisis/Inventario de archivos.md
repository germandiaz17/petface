---
tags: [analisis]
actualizado: 2026-10-18
---
# Inventario de archivos

| Archivo | Qué hace | Estado |
|---|---|---|
| `index.html` | Punto de entrada | Título "Vite + React", `lang="en"`, favicon de Vite |
| `src/main.jsx` | Monta `<App/>` | OK |
| `src/App.jsx` | Decide entre login y home según `user` | `user` es un array con un nombre; sin router |
| `src/App.css` | — | **Vacío** |
| `src/index.css` | Estilos globales | Plantilla de Vite (modo oscuro por defecto, `#404040`) que choca con el resto |
| `src/assets/imagenes.js` | Mapa de imágenes | Claves poco claras (`img1`, `publi`…) |
| `src/components/Formulario.jsx` | "Login": pide nombre | Ver [[Problemas detectados#Login]] |
| `src/components/formulario.css` | Estilos del login | Selector **global** `section { height: 90vh }` afecta a toda la app |
| `src/components/Home.jsx` | Página completa (230 líneas) | Mezcla todo: datos, secciones, footer |
| `src/components/home.css` | Estilos home | Selector global `header` |
| `src/components/Tarjeta.jsx` | Card de mascota + abre modal | Cada card monta su propio modal |
| `src/components/tarjeta.css` | Estilos card | OK |
| `src/components/Carta.jsx` | Modal de adopción | `class`/`for` en vez de `className`/`htmlFor`; input sin `onChange` |
| `src/components/carta.css` | Estilos modal | Posición fija en px (`left: 500px`), no responsive |
| `README.md` | — | Plantilla de Vite, no describe el proyecto |

## Imágenes (`src/assets/img`)
| Archivo | Uso |
|---|---|
| `paris.jpg`, `perro2.jpg`, `perro3.jpg`, `gato2.jpg` | Fotos de las 4 mascotas |
| `publicidad.jpg` (422 KB) | Fondo de la presentación — pesada |
| `papel_tapiz1.png` | Fondo del hero |
| `logo.png` | **Sin usar** |
| `fondo_verde1.png` | **Sin usar** |
