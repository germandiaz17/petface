---
tags: [analisis, bugs]
actualizado: 2026-10-18
---
# Problemas detectados

> [!success] Resueltos en la Fase 3
> Login real con contraseña y sesión persistente · form de donaciones ya no recarga la página · botón "cerrar" y validación del modal · `class`/`for` · input sin `onChange` · selector global `section` (se eliminó `formulario.css`) · datos de Max/Luna/Paris · lint en 0 errores · título y `lang` del HTML.

Prioridad: 🔴 alta · 🟠 media · 🟢 baja

## Login
- 🔴 No hay autenticación: cualquier texto entra. Sin contraseña, sin usuarios, sin roles.
- 🔴 La sesión vive en `useState`: **recargar la página cierra sesión**.
- 🟠 `user` es un array (`[nombre]`) y se renderiza como texto/valor de input; debería ser un objeto.
- 🟢 Mensaje "Todos los campos son obligatorios" con un solo campo.

## Bugs funcionales
- 🔴 **Donaciones**: el form usa `className="/ruta/de/tu/formulario" method="post"` (debía ser `action`). Al enviarlo, el navegador hace POST y **recarga la página → se pierde la sesión**.
- 🟠 **Modal (Carta)**: el botón "cerrar" está dentro del `<form>` sin `type="button"`, así que también es un *submit*.
- 🟠 **Modal**: "Enviar" hace `preventDefault` en `onClick`, lo que se salta la validación `required` → se puede "enviar" vacío.
- 🟠 **Modal**: `<input value={user}>` sin `onChange` → campo de solo lectura + warning de React.
- 🟠 **Modal**: `class` y `for` en JSX (deben ser `className` / `htmlFor`).
- 🟠 Los datos del formulario de adopción no se guardan en ningún sitio.
- 🟢 Enlaces del footer apuntan a `#`.

## Datos
- 🟠 Mascotas hardcodeadas en `Home.jsx` (no hay CRUD posible).
- 🟢 Inconsistencias: *Max* tiene raza "Huskye" pero la descripción dice Labrador; *Luna* tiene raza "Hembra" (debería ser Siamés); *paris* en minúscula. No hay campos de edad/especie separados.

## CSS / diseño
- 🔴 `formulario.css` define `section { height: 90vh; display:flex; ... }` **global** → todas las secciones de Home quedan forzadas a 90vh y centradas.
- 🟠 Selectores globales (`header`, `section`, `button`) mezclados entre archivos; `index.css` es la plantilla oscura de Vite y choca con el tema verde/blanco.
- 🟠 Modal con `position:absolute; left:500px; width:100vh` → se rompe en móvil y pantallas pequeñas.
- 🟠 No hay diseño responsive ni navegación (navbar).
- 🟢 Textos blancos sobre fondo imagen sin overlay → poco contraste.
- 🟢 `publicidad.jpg` pesa 422 KB.

## Calidad / proyecto
- 🟠 `npm run lint` → **23 errores** (prop-types y `class`/`for`).
- 🟠 `react-router-dom` instalado y sin usar.
- 🟢 README de plantilla, título "Vite + React", `lang="en"` en un sitio en español.
- 🟢 Sin tests, sin `.env`, sin scripts de BD.
- 🟢 npm 12 bloquea los *postinstall* de `esbuild` y `@swc/core` (aviso al instalar). El build funciona igual.

## Arquitectura
- 🔴 No hay separación de responsabilidades: `Home.jsx` es vista + datos + lógica. No hay MVC ni capa de servicios → ver [[Arquitectura propuesta]].
