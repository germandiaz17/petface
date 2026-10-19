---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Sistema distribuido

## Qué se hizo
Versión simple del [[Plan sistemas distribuidos]] (ver [[ADR-007 Sistema distribuido simple]]):
- Microservicio `notificaciones/` (Express + MVC) con eventos `solicitud.creada/aprobada/rechazada`, `donacion.recibida`, `testimonio.creado`.
- La API envía eventos desde los controladores con `services/notificador.js`.
- Campana 🔔 en la barra de navegación.
- Docker: `npm run distribuido` → gateway Nginx (:8080) + `api-1` + `api-2` + `notificaciones` + `db`.
- Tarjeta "Sistema distribuido" en *Admin → Resumen*.
- Vercel: `api/notif.js` + regla `/notif/*` en `vercel.json`.

## Verificado
- `npm test`: 19 pruebas de la API (2 nuevas de integración entre servicios) + 5 del microservicio ✅. Lint y build ✅.
- Docker:
  - Balanceo: 8 peticiones → `api-2 api-2 api-1 api-2 api-1 api-2 api-1 api-2`.
  - Ana crea una solicitud (API) → el admin ve "Ana Rodríguez quiere adoptar a Bella" (microservicio).
  - `docker stop petface-api-1 petface-notificaciones` → todo lo atiende `api-2`; la donación se guarda (201); en el log: `servicio no disponible… La operación continúa`.
- Navegador (localhost:8080): campana con aviso, tarjeta del admin mostrando las dos réplicas; campana en móvil.
- Simulación de Vercel: API y microservicio como funciones separadas con instancias distintas; el evento llega.

## En producción (petface.vercel.app)
- `/notif/health` responde desde una función distinta a la API (`vercel-notif-…` vs `vercel-…`).
- 40 peticiones simultáneas → Vercel encendió decenas de instancias de la API (escalado automático).
- Donación de prueba ("Prueba de despliegue", $1.000) → en los logs de Vercel: `POST /notif/eventos 201` (la API avisó al microservicio).
- Se quitó el aviso `SECURITY WARNING: The SSL modes 'prefer', 'require'…` de `pg` pidiendo `sslmode=verify-full`.

## Para la demo
Ver [[Guía de sustentación#Sistema distribuido (demo de 2 minutos)]].
