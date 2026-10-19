---
tags: [analisis]
actualizado: 2026-10-18
---
# Estado actual

## Resumen en una frase
Una **SPA de React** sin backend: un "login" que solo pide un nombre, y una página única con 4 mascotas escritas a mano en el código.

## Stack
| Pieza | Versión | Nota |
|---|---|---|
| React | 18.2 | |
| Vite | 5.2 (plugin SWC) | `npm run dev` / `npm run build` |
| react-router-dom | 6.23 | **instalado pero no se usa** |
| sweetalert | 2.1 | alerta al "adoptar" |
| ESLint | 8 | 23 errores hoy |
| Backend / BD | — | **no existe** |
| Tests | — | no existen |

Entorno de la máquina (2026-10-18): Node 26, npm 12, Docker + Compose instalados (daemon apagado), sin `psql`.

## Flujo actual
```mermaid
flowchart LR
  A[App.jsx<br/>useState user = []] -->|user vacío| F[Formulario<br/>pide nombre]
  F -->|setUser nombre| A
  A -->|user con nombre| H[Home<br/>página larga]
  H --> T[4 × Tarjeta]
  T -->|Adoptar| C[Carta<br/>modal + form contacto]
  C -->|Enviar| S[swal 'Nos contactaremos']
  H -->|Cerrar sesión| A
```

- **Login**: `Formulario.jsx` guarda el nombre en un `useState` de `App`. Sin contraseña, sin registro, sin persistencia: al recargar la página se pierde la "sesión".
- **Home**: una sola página con presentación, hero, listado de mascotas, testimonios, donaciones y footer.
- **Datos**: mascotas y testimonios están *hardcodeados* en `Home.jsx`. Imágenes en `src/assets/img`.
- **Adopción**: el modal muestra datos y un formulario de contacto que no se guarda en ningún lado (solo muestra una alerta).
- **Donaciones**: formulario que no va a ningún lado (y recarga la página → cierra sesión).

## Historial git
3 commits (24-may-2024): `primera version`, `segundo cambio`, `tercer cambio`. Rama `master`.

## Qué se puede reutilizar
- La **idea y el contenido**: textos de hero, testimonios, footer, descripciones de mascotas.
- Las **imágenes** de mascotas (pasan a ser datos semilla de la BD).
- El color de marca verde `#5cb85c` como punto de partida → ver [[Guía de diseño]].
- La estructura de componentes `Tarjeta` / `Carta` (se rehacen, pero el concepto sirve).

Ver detalle en [[Problemas detectados]] e [[Inventario de archivos]].
