---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Fase 6: calidad y entrega

## Qué se hizo
- **Límite de intentos de login**: 5 fallos en 15 min por email → `429`. Con prueba automática.
- **Datos de demo** en `seed.sql`: tercer usuario (Carlos), dos solicitudes pendientes para Max (Max "en proceso"), una rechazada, 3 donaciones y un testimonio por revisar. Así el panel de admin tiene contenido y se puede mostrar el rechazo automático al aprobar.
- **Capturas** en `docs/capturas/`, generadas con Chrome headless (escritorio y móvil, público y admin).
- **README** reescrito: funcionalidades, capturas, arquitectura, instalación, API, seguridad, solución de problemas.
- [[Guía de sustentación]] y [[ADR-005 Fotos en disco local]].
- Rama `robustecer` fusionada en `master` (sin subir a GitHub).

## Verificado
- `npm test` 17/17 ✅ · `npm run lint` ✅ · `npm run build` ✅
- `npm run db:reset` carga los datos de demo sin errores.

## Resumen del proyecto completo
| Fase | Resultado |
|---|---|
| 0 | Análisis + este vault |
| 1 | `client/` + `server/` + PostgreSQL en Docker |
| 2 | API REST MVC con CRUD y reglas de adopción |
| 3 | Login real con roles y sesión persistente |
| 4 | Todas las secciones y el panel de admin |
| 5 | Subida de fotos, móvil y pulido visual |
| 6 | Seguridad del login, demo, README y guía de sustentación |
