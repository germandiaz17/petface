---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Fase 4: secciones y CRUD en la web

## Qué se hizo
- Nuevas páginas: Inicio, Adopta (catálogo), Detalle de mascota, Donar, Nosotros, Mi perfil, 404 y el **panel de admin** (resumen, mascotas, solicitudes, testimonios, donaciones). Ver [[Secciones de la app]].
- Las páginas se construyeron directamente con el sistema de diseño (la Fase 5 queda para pulir).
- Piezas reutilizables: `Layout`, `Navbar`, `Footer`, `PetCard`, `Modal`, `Confirmar`, `Campo` (input/select/textarea), `EstadoBadge`, estados de carga/vacío, `useApi`, toasts.
- Se eliminó la home vieja (`Home`, `Tarjeta`, `Carta` y sus CSS), `index.css` de Vite, `sweetalert` e imágenes sin uso. Favicon desde el logo.

## Bugs encontrados al probar en el navegador (y corregidos)
1. Pantalla en blanco: dos `useEffect` con cuerpo de una línea devolvían un valor; React espera nada o una función de limpieza.
2. Fechas un día adelantadas: columnas `TIMESTAMP` → `TIMESTAMPTZ` (requirió `npm run db:reset`).
3. Donar no precargaba nombre/email: la sesión llega después del primer render → `useEffect` que completa los campos.
4. Barra de scroll fantasma en las pestañas del admin; footer flotando en páginas cortas; padding lateral perdido en `.seccion.contenedor`; portada poco legible en móvil.

## Verificado
- Flujo completo en el navegador: crear mascota (admin) → solicitarla (Ana) → aparece en su perfil → admin la aprueba → mascota queda "adoptada". Donación → aparece en el admin. Filtros y búsqueda del catálogo.
- Vista móvil (390 px) de inicio, catálogo, detalle, perfil y admin.
- `npm test` 11/11 ✅ · `npm run lint` ✅ · `npm run build` ✅
- Nota: la extensión de Chrome volvió a dejar de enviar clics a mitad de la prueba; parte del flujo se ejecutó con clics disparados por JS sobre los mismos botones.

## Siguiente
[[Roadmap#Fase 5 — Diseño|Fase 5]]: pulido visual, tablas del admin en móvil, subida de fotos.
