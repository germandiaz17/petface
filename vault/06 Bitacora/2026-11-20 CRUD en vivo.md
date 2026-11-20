---
tags: [bitacora]
fecha: 2026-11-20
---
# 2026-11-20 · CRUD en vivo

## Qué se hizo
Ver [[ADR-008 CRUD en vivo con LISTEN NOTIFY]].
- `server/src/services/tiempoReal.js`: trigger + `LISTEN` + envío por SSE. Endpoint `GET /api/mascotas/eventos`.
- `server/src/config/instancia.js`: el nombre de la réplica pasa a ser también el `application_name` de la conexión a PostgreSQL.
- Gateway: `location = /api/mascotas/eventos` sin búfer; `proxy_connect_timeout 2s` (antes, con una réplica apagada, la primera petición tardaba ~14 s).
- `docker-compose.yml`: puerto del gateway configurable (`GATEWAY_PORT=8081 npm run distribuido`), porque el 8080 lo usa otro proyecto en esta máquina.
- Web: hook `useMascotasEnVivo`, indicador "● En vivo · conectado a api-X", aviso con quién hizo el cambio y quién lo entregó, tarjeta resaltada. En catálogo, inicio, ficha y admin de mascotas. `useApi` tiene `refrescar()` (recarga sin parpadeo).

## Verificado
- Dos conexiones SSE + crear/editar/borrar como admin + `UPDATE` en `psql`: los 4 avisos llegan a ambas; ej. INSERT hecho por `api-2` entregado por `api-1`.
- `docker stop petface-api-1`: la conexión en vivo se abre en `api-2` y sigue recibiendo cambios.
- Navegador: indicador y aviso "Luna fue actualizada por psql · entregado por api-1".
- Pruebas: 18/19 de la API (la que falla es de datos: el nombre de `ana@petface.com` está cambiado a "pedro" en la BD local; se arregla con `npm run db:reset`) y 5/5 del microservicio. Lint ✅.

## Presentación
Diapositivas "PetFace: Sistemas Distribuidos" (11): concepto, arquitectura, gateway, réplicas sin estado, microservicio, tolerancia a fallos, CRUD en vivo, demo, decisiones y cierre. Enlace: https://claude.ai/artifact/M411Xfw7HpZjjLiGT6XkRv
