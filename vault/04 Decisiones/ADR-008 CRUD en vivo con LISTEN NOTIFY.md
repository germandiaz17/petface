---
tags: [adr]
estado: aceptada
fecha: 2026-11-20
---
# ADR-008 · CRUD en vivo con PostgreSQL LISTEN/NOTIFY + Server-Sent Events

**Contexto**: para la sustentación se quiere ver el CRUD de mascotas "en vivo": si el admin crea, edita o borra una mascota, las demás pantallas abiertas se actualizan sin recargar. Con 2 réplicas de la API, un cambio hecho en `api-1` debe llegar también a los navegadores conectados a `api-2`.

**Decisión**
- Un **trigger** en la tabla `mascotas` hace `pg_notify('mascotas_cambios', …)` en cada INSERT/UPDATE/DELETE. Incluye `origen` = `application_name` de la conexión (`api-1`, `api-2` o `psql`).
- Cada réplica abre una conexión aparte que hace `LISTEN` y reenvía el aviso a sus navegadores por **Server-Sent Events** (`GET /api/mascotas/eventos`).
- PostgreSQL hace de **bus de mensajes** entre réplicas. El trigger se instala al arrancar la escucha (con un candado `pg_advisory_xact_lock` para que dos réplicas no choquen).
- En el navegador, `EventSource` reintenta solo: si cae la réplica, se reconecta por el gateway a la otra.

**Por qué**: no agrega servicios (ni Redis ni RabbitMQ) y capta cualquier cambio, incluso los que hace la lógica de solicitudes o un `UPDATE` manual en `psql`. SSE es más simple que WebSockets porque solo hace falta servidor → navegador.

**Limitaciones**
- En **Vercel** no hay tiempo real: las funciones no mantienen conexiones abiertas y Neon (pooled) no admite `LISTEN`. El endpoint responde 204 y el navegador deja de intentarlo.
- Los avisos no se guardan: un navegador desconectado en ese momento no los recibe (al reconectar ve los datos actuales al recargar).

Relacionado: [[ADR-007 Sistema distribuido simple]], [[Modelo de datos]].
